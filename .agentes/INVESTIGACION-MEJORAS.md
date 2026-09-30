# Investigación de mejoras para el sitio — 30/09/2026

Pedido de Leandro: revisar sitios del rubro y de rubros con el mismo tipo de venta (ticket alto,
cotizado a medida) para ver qué se le puede sumar al sitio. Se abrieron ~55 sitios en total con
cuatro investigadores en paralelo (fabricantes internacionales, competidores de Argentina y la
región, servicios B2B, y empresas de USD 5.000 a 50.000 de otros rubros).

**Límites:** el buscador devolvió poco de este rubro; las páginas se leyeron con un resumen hecho
por un modelo chico, no con el HTML crudo; no se pudo medir velocidad ni datos estructurados de
los sitios ajenos. Conviene abrir a mano los 2 o 3 que más interesen. Un dato: **ningún taller
argentino de tercer eje o alargue de chasis tiene un sitio mejor que el de EyS** en WhatsApp
directo, preguntas frecuentes y textos por ciudad. Lo que le falta es evidencia.

## Lo que coincidió en 3 o 4 de los informes

| # | Mejora | Quién la usa | Qué hace falta |
|---|---|---|---|
| 1 | **Credenciales a la vista**: número de inscripción del taller, nombre del ingeniero, certificados | Brugsa, Dubini, Helvetica (ISO), LCOE, Utilimaster | **Datos de Leandro** |
| 2 | **Garantía escrita** (qué cubre, cuántos años, cómo reclamar) | Hendrickson, Desjoyaux. Casi nadie del rubro en Argentina la publica | **Datos de Leandro** |
| 3 | **Fichas técnicas en PDF** y tabla de especificaciones por modelo | Carlos Boero, Helvetica, Hendrickson, Link | **Datos y material de Leandro** |
| 4 | **"Cómo trabajamos" en 3 o 4 pasos** | PTR, Knapheide, Infinito Energía, Energía Verde | Nada: se puede hacer ya, sin plazos nuevos |
| 5 | **Casos con cliente nombrado** y fotos antes/después | Knapheide, Bonano, Faymonville | **Autorización del cliente y fotos** |
| 6 | **Selector "¿Qué unidad tenés?"** en la portada, que lleve a la página de servicio | Hendrickson, Scania, Randon, Nooteboom | Nada: HTML plano |
| 7 | **Guías "cuándo conviene"** (tercer eje vs camión nuevo, tipos de eje) que terminan en botón de cotizar | HBZ, Truckj, Custom Truck, River Pools | La parte normativa la valida Leandro |
| 8 | **Video propio corto** (mp4 liviano, no YouTube) | Hermann, Silfred, Faymonville | **Filmar un trabajo** |
| 9 | **Bloque "Vení a ver cómo trabajamos"** y lista de ciudades atendidas | Silfred, Knapheide, Helvetica | Nada |

## Conflicto entre informes, resuelto

Un informe recomienda sumar campos propios al formulario (marca, modelo, voladizo). Otros dos
muestran que los formularios largos espantan (Custom Truck pide 11 campos obligatorios; los que
mejor convierten piden 4). **Decisión: no tocar el formulario.** Ya pide nombre, teléfono, trabajo y
unidad opcional, y WhatsApp recibe el resto.

## No viable para EyS (no insistir)

Financiación y cuotas (no hay datos), configurador o cotizador con precio (los precios no se
publican), buscador de sucursales, calculadoras de amortización, portales de cliente, tienda online,
captcha en el formulario, YouTube o Instagram incrustados (recurso de terceros).

## Hallazgo de la auditoría propia

- El iframe del mapa de la portada busca **"Bv San Diego 2103"**; las otras 56 menciones del sitio
  dicen **"Av"**. Es el único "Bv" del sitio. No se tocó: corregirlo puede mover el pin del mapa y
  conviene que Leandro confirme cómo figura la calle en la ficha de Google.
- El mapa es un recurso de terceros (Google) y no figura entre las dos excepciones de CLAUDE.md.
  Ya estaba así antes; queda anotado por si se quiere formalizar.
