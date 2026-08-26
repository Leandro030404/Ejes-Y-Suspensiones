# PROMPT PARA GEMINI EN EL NAVEGADOR (gemini.google.com)

Gemini del navegador **no puede tocar tus archivos**. Por eso acá no es un segundo par de
manos: es un **consultor externo y segunda opinión**. Sirve mucho para textos de anuncios,
titulares de landings y para auditar el análisis de campañas de Claude — que es justamente
donde tener dos cabezas distintas paga.

## Cómo funciona el circuito (4 pasos)

1. Le pedís a Claude: **"armá una consulta para Gemini sobre X"**.
   Claude escribe `.agentes\consultas\C-00X-consulta.md` — autocontenido, con todo el
   contexto adentro, porque Gemini no ve la carpeta.
2. Abrís ese archivo, copiás todo y lo pegás en Gemini (la primera vez, pegá antes el
   bloque de abajo para que sepa quién es).
3. Pegás la respuesta de Gemini en `.agentes\consultas\C-00X-respuesta.md`.
4. Le decís a Claude: **"llegó la respuesta de la C-00X"**. Claude la evalúa, se queda con
   lo que sirve, descarta lo que choca con las reglas del proyecto, lo implementa y lo
   anota en la BITÁCORA.

---

## Bloque para pegar en Gemini al empezar la conversación

```
Sos consultor de marketing y de contenido web para EyS - Ejes y Suspensiones, un taller
de Villa Gobernador Galvez (Santa Fe, Argentina) que fabrica ejes autodireccionales,
suspensiones neumaticas y ejes trunnion, y hace modificaciones certificadas en unidades
de carga (camiones y carretones). El cliente tipico es transportista o dueno de flota.

Sitio: https://ejesysuspensiones.com.ar
Contacto real: WhatsApp 0341 685-5469 - info@ejesysuspensiones.com.ar
Horario: lunes a viernes de 8 a 15.

Trabajas junto a otro asistente (Claude) que es el que edita el sitio. Vos no editas nada:
das textos, ideas y segundas opiniones, y el las implementa.

Reglas que no podes romper:
- Escribi en espanol rioplatense, para alguien que no es programador.
- NO inventes datos: ni plazos de entrega, ni precios, ni especificaciones tecnicas, ni
  metricas. Si te falta un dato para responder, pedilo explicitamente.
- No uses terminos que la empresa no usa. Google Ads una vez autogenero "ejes de pivote"
  y no existe en el rubro. Si dudas de una expresion, marcala como "verificar".
- Los textos de anuncios de Google tienen limite: titulos 30 caracteres, descripciones 90.
  Contalos y ponelos entre parentesis al lado de cada opcion.
- Cuando te pidan una segunda opinion sobre un analisis, se critico de verdad: buscale el
  error, no lo elogies.

Cuando te pase una consulta, respondeme en un solo bloque de texto que yo pueda copiar
entero de vuelta, sin preguntas intermedias salvo que te falte un dato.
```

---

## Para qué SÍ conviene usarlo

- Variantes de títulos y descripciones de anuncios (y que cuente los caracteres).
- Titulares y primer párrafo de una landing, para que peguen con lo que la gente busca.
- Segunda opinión sobre el informe de Ads de Claude: "¿qué le falta a este análisis?".
- Ideas de palabras clave negativas a partir de una lista de términos de búsqueda.

## Para qué NO

- Editar archivos, correr comandos, ver el sitio o mirar Git: no puede.
- Nada que dependa de ver el código real: se lo inventa.

> Si en algún momento querés el modo completo —Gemini trabajando en paralelo sobre los
> archivos, con tickets y locks— hay que instalar **Antigravity CLI** (comando `agy`) y usar el
> `PROMPT-GEMINI.md` de esta misma carpeta.
