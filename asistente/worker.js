/* ═══════════════════════════════════════════════════════════════════
   EyS · Asistente del sitio — intermediario en Cloudflare Workers

   QUE ES: el código que se pega en Cloudflare. El navegador del visitante
   le habla a ESTE archivo, y este le habla a la IA de Google. La clave de
   Google vive acá adentro, guardada por Cloudflare, y NUNCA viaja al
   navegador. Por eso hace falta un intermediario y no se llama a Google
   directo desde el sitio: cualquiera podría ver la clave y gastarla.

   COMO SE INSTALA (todo desde el navegador, sin instalar nada):
   1. dash.cloudflare.com → Compute (Workers) → Create → Start from Hello World
   2. Nombre: eys-asistente · Deploy
   3. Edit code → borrar lo que haya → pegar este archivo entero → Deploy
   4. Settings → Variables and Secrets → Add → tipo Secret
      Nombre: GEMINI_API_KEY   Valor: la clave de Google → Deploy
   5. Copiar la dirección que queda (eys-asistente.<algo>.workers.dev)

   NO se toca el DNS del dominio. El sitio sigue en GitHub Pages.
   ═══════════════════════════════════════════════════════════════════ */

/* Solo estos sitios pueden usar el asistente. Sin esto, cualquier web
   podría colgarse de la clave y gastarle el cupo gratuito al taller. */
const ORIGENES = [
  'https://ejesysuspensiones.com.ar',
  'https://www.ejesysuspensiones.com.ar',
  'http://localhost:8791'
];

/* Topes. El cupo gratuito de Google es generoso pero no infinito: si alguien
   (una persona o un robot) dispara mil mensajes, el asistente queda mudo para
   los clientes reales. Estos topes lo evitan. */
const POR_IP_MINUTO = 6;
const POR_IP_DIA    = 60;
const TOTAL_DIA     = 800;

const MODELOS = ['gemini-3.1-flash-lite', 'gemini-3.5-flash-lite', 'gemini-3.6-flash', 'gemini-flash-lite-latest'];

/* ── Lo que el asistente sabe ────────────────────────────────────────
   TODO lo de acá sale del sitio y de la ficha de Google. Si un dato no
   está en esta lista, el asistente tiene prohibido inventarlo.        */
const CONOCIMIENTO = `
Sos el asistente del sitio de EyS - Ejes y Suspensiones, un taller metalurgico de
Villa Gobernador Galvez, provincia de Santa Fe, Argentina, que trabaja desde 2005.
Hablas en espanol rioplatense, de vos, con frases cortas. Sos claro y directo, como
alguien del taller: nada de lenguaje publicitario.

DATOS DEL TALLER (los unicos que podes dar):
- Direccion: Av. San Diego 2103, Villa Gobernador Galvez, Santa Fe.
- WhatsApp y telefono: 0341 685-5469.
- Correo: info@ejesysuspensiones.com.ar.
- Horario de atencion: lunes a viernes de 8 a 15. Sabados y domingos cerrado.
- Calificacion en Google: 5,0 con alrededor de 20 opiniones.

QUE HACE EL TALLER (10 trabajos):
1. Colocacion de tercer eje neumatico.
2. Escalabilidad y modificacion de chasis.
3. Cambio de chasis a tractor.
4. Carrocerias y semirremolques.
5. Instalacion de sistema de freno ABS.
6. Fabricacion de ejes autodireccionales.
7. Ejes trunnion y carretones.
8. Suspensiones neumaticas.
9. Trenes rodantes agricolas.
10. Componentes y repuestos.
Ademas hace modificaciones certificadas en unidades de carga.

PLAZOS: el UNICO plazo confirmado es el del tercer eje: 10 a 15 dias habiles.
De ningun otro trabajo sabemos el plazo. Si preguntan por otro, deci que el plazo
lo confirma el taller segun la unidad, y ofrece pasar la consulta por WhatsApp.

REGLAS QUE NO PODES ROMPER:
- NUNCA des un precio, ni un rango, ni un "aproximadamente". No los sabes. Los
  presupuestos los hace el taller mirando la unidad.
- NUNCA inventes plazos, medidas, capacidades de carga ni normativa. Si no esta
  en esta lista, no lo sabes, y lo decis sin vueltas.
- NUNCA prometas que un trabajo se puede hacer en una unidad concreta. Eso lo
  define el taller cuando la ve.
- Si te preguntan algo que no es sobre EyS o sus trabajos, decilo amablemente y
  volve al tema.
- No pidas datos personales. Marca, modelo y ano de la unidad, si.

TU OBJETIVO: que la persona termine escribiendo al taller por WhatsApp con la
consulta completa. Para eso, cuando entiendas que trabajo necesita, pedile la
marca, el modelo y el ano de la unidad, y despues invitala a pasar a WhatsApp.
Respuestas de 3 o 4 renglones como mucho.
`.trim();

/* ── Topes, en la memoria del Worker ──────────────────────────────── */
const memoria = new Map();

function contar(clave, ventanaMs, tope) {
  const ahora = Date.now();
  const dato = memoria.get(clave);
  if (!dato || ahora > dato.hasta) {
    memoria.set(clave, { n: 1, hasta: ahora + ventanaMs });
    return true;
  }
  if (dato.n >= tope) return false;
  dato.n++;
  return true;
}

const MINUTO = 60 * 1000;
const DIA    = 24 * 60 * MINUTO;

function respuesta(obj, estado, origen) {
  return new Response(JSON.stringify(obj), {
    status: estado || 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': origen || ORIGENES[0],
      'Vary': 'Origin'
    }
  });
}

export default {
  async fetch(request, env) {
    const origen = request.headers.get('Origin') || '';
    const permitido = ORIGENES.includes(origen);

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': permitido ? origen : ORIGENES[0],
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
          'Vary': 'Origin'
        }
      });
    }

    if (!permitido) return respuesta({ error: 'origen' }, 403);
    if (request.method !== 'POST') return respuesta({ error: 'metodo' }, 405);

    /* Sin clave cargada, el asistente no finge: avisa y manda al formulario. */
    if (!env.GEMINI_API_KEY) {
      return respuesta({
        reply: 'El asistente todavia se esta configurando. Escribinos por WhatsApp al ' +
               '0341 685-5469 y te contestamos apenas abrimos.',
        sinClave: true
      }, 200, origen);
    }

    const ip = request.headers.get('CF-Connecting-IP') || 'sin-ip';
    const ocupado =
      !contar('m:' + ip, MINUTO, POR_IP_MINUTO) ||
      !contar('d:' + ip, DIA, POR_IP_DIA) ||
      !contar('total', DIA, TOTAL_DIA);

    if (ocupado) {
      return respuesta({
        reply: 'Estoy recibiendo muchas consultas juntas. Escribinos por WhatsApp al ' +
               '0341 685-5469 y te contestamos a la brevedad.',
        limite: true
      }, 200, origen);
    }

    let cuerpo;
    try { cuerpo = await request.json(); }
    catch (e) { return respuesta({ error: 'json' }, 400, origen); }

    const cuerpoDiag = cuerpo && cuerpo.diagnostico === true;
    const mensaje = String(cuerpo.message || '').slice(0, 1000).trim();
    if (!mensaje) return respuesta({ error: 'vacio' }, 400, origen);

    /* Solo los ultimos 6 turnos: alcanza para que siga el hilo y no infla el gasto. */
    const historia = Array.isArray(cuerpo.history) ? cuerpo.history.slice(-6) : [];
    const contents = historia
      .filter(t => t && t.rol && t.texto)
      .map(t => ({
        role: t.rol === 'asistente' ? 'model' : 'user',
        parts: [{ text: String(t.texto).slice(0, 1000) }]
      }));
    contents.push({ role: 'user', parts: [{ text: mensaje }] });

    const pedido = {
      systemInstruction: { parts: [{ text: CONOCIMIENTO }] },
      contents: contents,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1200,   /* Los modelos nuevos gastan parte de este presupuesto
                                     "pensando" antes de escribir. Con 500 la respuesta
                                     salia cortada a la mitad. */
        thinkingConfig: { thinkingBudget: 0 }
      },
      safetySettings: [
        'HARM_CATEGORY_HARASSMENT',
        'HARM_CATEGORY_HATE_SPEECH',
        'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        'HARM_CATEGORY_DANGEROUS_CONTENT'
      ].map(c => ({ category: c, threshold: 'BLOCK_ONLY_HIGH' }))
    };

    /* Modo diagnostico: le pregunta a Google que modelos tiene disponibles esta
       clave y devuelve el error tal cual si algo falla. NUNCA devuelve la clave.
       Se usa solo para depurar desde afuera; un visitante nunca pasa por aca. */
    if (cuerpoDiag) {
      const salida = { modelos: null, errores: [] };
      try {
        const r = await fetch(
          'https://generativelanguage.googleapis.com/v1beta/models',
          { headers: { 'x-goog-api-key': env.GEMINI_API_KEY } }
        );
        const txt = await r.text();
        if (r.ok) {
          try {
            salida.modelos = (JSON.parse(txt).models || [])
              .map(m => m.name)
              .filter(n => n.indexOf('gemini') !== -1);
          } catch (e) { salida.modelos = 'no pude leer la lista'; }
        } else {
          salida.errores.push({ paso: 'listar modelos', estado: r.status, detalle: txt.slice(0, 400) });
        }
      } catch (e) {
        salida.errores.push({ paso: 'listar modelos', excepcion: String(e).slice(0, 200) });
      }

      for (const modelo of MODELOS) {
        const t0 = Date.now();
        try {
          const r = await fetch(
            'https://generativelanguage.googleapis.com/v1beta/models/' + modelo + ':generateContent',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY },
              body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: 'hola' }] }] })
            }
          );
          const txt = await r.text();
          let corte = '';
          if (r.ok) { try { corte = ' finishReason=' + JSON.parse(txt).candidates[0].finishReason; } catch (e) {} }
          salida.errores.push({ modelo: modelo, estado: r.status, ms: Date.now() - t0, detalle: r.ok ? 'OK' + corte : txt.slice(0, 300) });
        } catch (e) {
          salida.errores.push({ modelo: modelo, excepcion: String(e).slice(0, 200) });
        }
      }
      return respuesta(salida, 200, origen);
    }

    /* Si un modelo falla o esta saturado, probamos el siguiente.
       La clave viaja en un encabezado, no en la direccion: asi no queda escrita
       en ningun registro de servidor intermedio.

       El segundo intento sin thinkingConfig existe porque ese ajuste es de la
       familia 2.5 y no todos los modelos nuevos lo aceptan: si lo rechazan
       (error 400) volvemos a preguntar sin el, en vez de darnos por vencidos. */
    async function pedirle(modelo, conAjustes) {
      const cuerpoPedido = JSON.parse(JSON.stringify(pedido));
      if (!conAjustes) delete cuerpoPedido.generationConfig.thinkingConfig;
      return fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/' + modelo + ':generateContent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': env.GEMINI_API_KEY
          },
          body: JSON.stringify(cuerpoPedido),
          /* Si un modelo esta saturado no lo esperamos eternamente: a los 9
             segundos cortamos y probamos el siguiente. Sin esto, un modelo
             caido le suma su demora a todas las respuestas. */
          signal: AbortSignal.timeout(8000)
        }
      );
    }

    for (const modelo of MODELOS) {
      try {
        let r = await pedirle(modelo, true);
        if (r.status === 400) r = await pedirle(modelo, false);
        if (!r.ok) continue;
        const data = await r.json();
        const texto = data &&
          data.candidates && data.candidates[0] &&
          data.candidates[0].content && data.candidates[0].content.parts &&
          data.candidates[0].content.parts[0] &&
          data.candidates[0].content.parts[0].text;
        if (texto) return respuesta({ reply: String(texto).trim() }, 200, origen);
      } catch (e) { /* probamos el siguiente modelo */ }
    }

    /* Nunca mostramos el error crudo: mensaje humano y camino alternativo. */
    return respuesta({
      reply: 'Ahora mismo no puedo contestarte. Escribinos por WhatsApp al ' +
             '0341 685-5469 y te respondemos en cuanto abrimos (lunes a viernes de 8 a 15).',
      falla: true
    }, 200, origen);
  }
};
