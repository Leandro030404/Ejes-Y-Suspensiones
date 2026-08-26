# TABLERO — PAGINA EYS

Único canal entre CLAUDE y GEMINI. Nadie empieza nada que no esté escrito acá.
Prefijos: **G-** = web · **A-** = mejora ligada a Google Ads.

Formato de ticket:

```
### [G-00X] Título corto
- objetivo: qué tiene que quedar funcionando (resultado observable)
- archivos_permitidos: rutas exactas
- archivos_prohibidos: los que está tocando el otro
- criterio_de_aceptacion: qué abro y qué tengo que ver
- notas: contexto mínimo
```

---

## BACKLOG

### [G-001] Resolver los cambios sin commitear que hay en la carpeta
- objetivo: la carpeta queda limpia (`git status` sin cambios pendientes) y con el historial claro
- archivos_permitidos: los 12 ya modificados (index.html, las 10 paginas de servicio, CLAUDE.md, .gitignore)
- criterio_de_aceptacion: `git status --short` no devuelve nada y el sitio en vivo sigue igual o mejor
- notas: **PRIMERO DE TODO.** Al 26/08 hay 12 archivos modificados sin commitear. Hasta no
  resolver esto, cualquier commit de un ticket nuevo se mezcla con trabajo a medio hacer.
  Claude revisa el diff, le explica a Leandro qué es cada cambio y recién ahí commitea.
- responsable sugerido: CLAUDE

### [A-001] Verificar que las 3 conversiones disparan de verdad
- objetivo: confirmar, probando, que el clic en WhatsApp, el clic en telefono y el envio del
  formulario disparan su evento en las 11 paginas
- archivos_permitidos: (ninguno, es verificacion) — si aparece un error, se abre ticket aparte
- criterio_de_aceptacion: informe corto en `.agentes/ads/INFORME.md` diciendo pagina por pagina
  si dispara o no
- notas: la medicion se instalo el 23/08 y el oyente delegado esta al final de `assets/js/main.js`.
  Antes de optimizar nada hay que estar seguro de que lo que medimos es real.
- responsable sugerido: CLAUDE

### [A-002] Contacto visible sin scrollear en celular
- objetivo: en las 11 paginas, entrando desde un celular, se ve un boton de WhatsApp o de
  telefono sin necesidad de scrollear
- archivos_permitidos: a definir por Claude cuando arme el ticket
- criterio_de_aceptacion: abrir cada pagina a 390px de ancho y ver el boton en la primera pantalla
- notas: el trafico de Google Ads de este rubro entra casi todo desde el celular. Un cambio por
  pagina por vez; anotarlo en `.agentes/ads/CAMBIOS.md`.
- responsable sugerido: GEMINI

### [A-003] Revision de la campana nueva a los 14 dias
- objetivo: mirar las conversiones de "Maximo rendimiento - Sitio Web" recien el **7 de septiembre**
- criterio_de_aceptacion: informe con la comparacion contra el periodo anterior
- notas: la campana se creo el 24/08 y esta en aprendizaje. **No tocarla antes del 7/09.**
- responsable sugerido: CLAUDE

## ASIGNADO A GEMINI

_(vacio — Claude carga los tickets acá con archivos_permitidos ya definidos)_

## EN CURSO

_(vacio)_

## HECHO

_(vacio)_

## DUDAS PARA LEANDRO

- Los 12 archivos modificados sin commitear: ¿son cambios que querés conservar o quedaron a medias?
- Plazos de entrega de los otros 9 trabajos (el del tercer eje ya está: 10 a 15 días hábiles).
  Sin ese dato no se pueden completar las páginas de servicio.
- ¿A qué página cae cada anuncio hoy? Si todo cae en la portada, conviene mandar cada grupo
  a su página de servicio: es de lo que más mueve la aguja.
