# INFORME DE GOOGLE ADS

> Todavía **sin datos de campañas**. Para el primer informe real: bajá de Google Ads los CSV
> de los últimos 7 días (Campañas · Grupos de anuncios · Palabras clave · Términos de búsqueda
> · Anuncios), dejalos en `.agentes/ads/exports/` y pedí la revisión.

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
