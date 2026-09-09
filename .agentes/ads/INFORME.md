# INFORME DE GOOGLE ADS

## Revision de campanas — 07/09/2026 (datos del 24/08 al 06/09, via Supermetrics)

### Resumen en numeros (14 dias)

| Campana | Gasto | Clics | Costo/clic | "Conversiones" | Costo/conv |
|---|---|---|---|---|---|
| Maximo rendimiento - Sitio Web (ARS 4.000/dia) | 53.697 | 1.621 | 33 | 75 (72 WhatsApp + 3 telefono) | 716 |
| Busqueda - Sitio Web (ARS 1.500/dia) | 14.344 | 61 | 235 | 8 (todas WhatsApp) | 1.793 |
| Ejes Y Suspensiones (vieja) | 228 | 8 | — | 0 | — (ya figura ELIMINADA, no pausada) |

### Hallazgo 1 — las 75 "conversiones" estan infladas; las reales son ~2 por dia

Hasta el 04/09 la conversion se contaba al TOCAR el boton de WhatsApp. Ese dia se publicaron
G-007 y G-012: el boton abre primero el panel (trabajo + unidad) y la conversion se cuenta
solo cuando WhatsApp se abre de verdad. El efecto se ve clarisimo en la serie diaria de
Maximo rendimiento:

- 01/09: 115 clics, 10 conv · 02/09: 151, 5 · 03/09: 185, 14
- 04/09: 195 clics, 2 conv · 05/09: 163, 3 · 06/09: 214, 0

Los clics suben y las conversiones se desploman. No se rompio nada: ahora se mide lo que
importa. Esto coincide con lo que Leandro ve en el WhatsApp (muchos toques, pocos mensajes).
Con la medida nueva: ~5 conversiones en 3 dias con ARS 12.800 de gasto = ~ARS 2.500 por
apertura real de WhatsApp, y no todas terminan en mensaje.

**Consecuencia:** la campana de Maximo rendimiento aprendio dos semanas con una senal falsa
("gente que toca botones"). Ahora recibe la senal correcta y hay que darle otras 2 semanas
antes de juzgarla, sin tocarla.

### Hallazgo 2 — Maximo rendimiento compra toques baratos en celulares

- 99,6% del gasto en celulares; 0 clics desde computadoras.
- Costo por clic ARS 33 (7 veces mas barato que Busqueda). Un clic tan barato en un rubro
  como este es tipico de anuncios en apps, YouTube y Discover, no de gente buscando un taller.
- Un solo grupo de recursos ("Grupo de recursos 1"). Google no deja ver por API en que
  sitios/apps se muestra ni que busquedas dispara; eso se mira en la cuenta: Estadisticas ->
  "Terminos de busqueda" y "Ubicaciones donde se mostraron los anuncios".

### Hallazgo 3 — Busqueda gasta ARS 14.344 y no "casi cero": CLAUDE.md estaba viejo

Desde el 26/08 gasta entre ARS 500 y 2.300 por dia (Google puede doblar el diario). Y de esos
14.344, cerca de ARS 2.000 se fueron en busquedas que no son clientes:

- Marcas de la competencia: "eje alko" (3 clics, ARS 954), "boero autopartes" (246),
  "boero ejes" (227), "piotto ejes" (274). Tambien aparecen sin clic: msm, san miguel,
  hermann, lambert, astivia, rubiolo, gec, helvetica, sola y brusa, pellacani, carfer.
- Trailers chicos y acoplados: "eje para carro de arrastre 1500 kg", "ejes para trailers",
  "ejes de torsion para trailers", "fabrica acoplados acoplar" (1 clic, ARS 259).
- Mecanica general y curiosidad: cardan, diferencial, alineacion, repuestos, toma de fuerza,
  butaca neumatica, pulmones, "tabla de peso por eje", "como alinear...", "que significa
  caja fuller".
- Modelos de camion sueltos: mercedes 1620, iveco stralis, ford cargo, scania, etc.
- "camiones" a secas: 48 impresiones. Es la concordancia amplia estirando "tercer eje camion".

Ademas la campana de Busqueda tiene la **Red de Display encendida**: 172 impresiones, 14
clics, ARS 1.863, en sitios que no son Google. Eso es una casilla que viene marcada por
defecto al crear la campana.

Lo que si funciona en Busqueda: "colocacion tercer eje" (2 conv), "ejes para carreton"
(2 conv, aunque a ARS 305 el clic), "tercer eje", "eje camion", "ejes para semirremolque"
y la busqueda de marca "ejes y suspensiones" (1 conv).

### Que hacer (en orden) — HECHO el 07/09/2026 por Claude en la cuenta, salvo el punto 5

No se agregaron como negativas "repuestos" (EyS vende componentes) ni "acoplado" (a confirmar por
Leandro). Presupuestos finales: Busqueda 2.500, Maximo rendimiento 3.000. Las 31 palabras en
concordancia amplia pasaron a frase (la cuenta tiene 63 palabras clave en total).

1. **Busqueda -> Configuracion -> Redes: destildar "Red de Display".** Dos minutos, ahorra
   ~ARS 900 por semana.
2. **Sumar negativas a la lista "Negativas EyS"** (asi aplican a las 2 campanas):
   alko, boero, piotto, msm, san miguel, hermann, lambert, astivia, rubiolo, helvetica,
   pellacani, carfer, sola y brusa, trailer, trailers, carro de arrastre, acoplado, acoplados,
   cardan, diferencial, alineacion, alinear, repuestos, toma de fuerza, butaca, pulmon,
   pulmones, vejigas, tabla de peso, caja fuller, que significa, como alinear, como
   desenganchar.
   OJO con "acoplado": EyS hace ejes para semirremolques y carretones, no para acoplados
   rurales chicos; si Leandro tambien vende para acoplados, no negarla.
3. **Pasar las palabras clave de Busqueda de concordancia amplia a concordancia de frase**
   (poner comillas: "tercer eje camion"). Corta el estiramiento a "camiones" y a modelos
   de camion sueltos. Riesgo: menos impresiones; con el mercado chico conviene igual.
4. **Maximo rendimiento: no tocar hasta el 18/09.** Recien aprende con la conversion real.
   Si para entonces sigue en ~2 conversiones reales por dia a ARS 4.000, bajar el
   presupuesto a 2.500 y pasar la diferencia a Busqueda, que trae menos clics pero de gente
   que busca justo esto.
5. **Cuando Leandro entre a la cuenta**, mirar en Maximo rendimiento: Estadisticas ->
   Terminos de busqueda y Ubicaciones. Si la mayoria del gasto esta en apps/YouTube, agregar
   exclusiones de ubicacion (o pedirle a soporte que excluya apps).
6. El aviso de "conversiones avanzadas" del diagnostico: apagar esa opcion en "Clic en
   WhatsApp" y "Clic en telefono". No hay dato de la persona en un clic; no se puede
   implementar nada.

### Lo que no se pudo ver por API

Geografia (de donde son los clics), ubicaciones/apps de Maximo rendimiento y sus terminos
de busqueda. Se miran en la cuenta.

---

## A-001 · Verificación de la medición de conversiones — 26/08/2026

**Resultado: la medición está bien puesta.** Se revisó el código, no se probó clic por clic
en el navegador; todo lo verificable por código da correcto.

| Qué se verificó | Resultado |
|---|---|
| Etiqueta `AW-18384322870` en el `<head>` | ✅ en las 11 páginas |
| `gtag('config','AW-18384322870')` completo | ✅ presente y bien formado |
| `assets/js/main.js` cargado | ✅ en las 11 páginas |
| Oyente delegado de clics | ✅ en fase de captura, dispara antes de que el navegador se vaya |
| Enlaces de WhatsApp | ✅ todos con `target="_blank"`: la página queda viva y el evento llega |
| Enlaces de teléfono | ✅ detectados por `tel:` |
| Formulario | ✅ dispara `formulario`, y como abre WhatsApp con `window.open` (no es un enlace) **no cuenta doble** |

### Lo único que apareció mal: la documentación, no el código

`CLAUDE.md` decía que el formulario llama a `eysConversion('whatsapp')`. El código llama a
`eysConversion('formulario')`, que es lo correcto y lo que el propio CLAUDE.md describe dos
párrafos antes. Era un error de redacción que podía hacer que alguien "arreglara" algo que
funciona bien. Corregido el 26/08/2026.

### Detalle menor, sin acción por ahora

`404.html` no lleva la etiqueta ni `main.js`. No afecta a las campañas (nadie convierte en una
página de error) y no tiene botones de contacto. Se deja anotado y nada más.

### Lo que NO se puede verificar desde el código

Que las tres acciones figuren como **activas y principales** dentro de Google Ads, y que
estén recibiendo conversiones. Eso se mira en la cuenta, en Objetivos → Conversiones →
Resumen. Si alguna dice "Inactiva" o "Sin actividad reciente" después de dos semanas con
tráfico, avisá: ahí sí hay algo roto.
