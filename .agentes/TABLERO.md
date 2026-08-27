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

### [A-003] Revision de la campana nueva a los 14 dias
- objetivo: mirar las conversiones de "Maximo rendimiento - Sitio Web" recien el **7 de septiembre**
- criterio_de_aceptacion: informe con la comparacion contra el periodo anterior
- notas: la campana se creo el 24/08 y esta en aprendizaje. **No tocarla antes del 7/09.**
- responsable sugerido: CLAUDE

## ASIGNADO A GEMINI

### [A-002] Que el boton de WhatsApp se vea sin scrollear en celular
- objetivo: en pantallas de hasta 900px de ancho, el boton verde flotante de WhatsApp
  (`.wsp-float`) se ve desde que carga la pagina, sin necesidad de scrollear. En pantallas
  mas grandes se comporta exactamente igual que hoy.
- archivos_permitidos: `assets/css/styles.css` (SOLO dentro del bloque `@media (max-width:900px)`)
- archivos_prohibidos: `assets/js/main.js` (lo maneja Claude), todos los `.html`
- criterio_de_aceptacion: abrir `index.html` y `tercer-eje/index.html` con el servidor local,
  poner el navegador a 390px de ancho, NO scrollear: se ve el boton verde. Achicar y agrandar:
  a 901px o mas, sigue apareciendo recien al scrollear, como ahora.
- notas:
  * Hoy `.wsp-float` arranca invisible y `main.js` le agrega la clase `.is-visible` recien a
    los **420px de scroll** (linea 53 de main.js). En celular, el visitante que llega de un
    anuncio ve la primera pantalla SIN ningun boton de contacto directo: el de WhatsApp del
    menu esta escondido detras de la hamburguesa, y en el hero solo hay un enlace `#contacto`
    que lleva mas abajo.
  * **Resolvelo por CSS, no toques main.js.** Dentro del `@media (max-width:900px)` alcanza
    con que `.wsp-float` quede visible por defecto (opacidad, visibilidad y transform en su
    estado final), sin depender de `.is-visible`.
  * Fijate que no tape texto ni botones del hero en 390px. Si tapa algo, decilo en
    `## DUDAS PARA LEANDRO` en vez de mover el hero: el hero no es tuyo en este ticket.
  * Es un cambio que afecta a las 11 paginas de una sola vez, porque el CSS es compartido.
    Anotalo en `.agentes/ads/CAMBIOS.md` como un solo cambio.



## EN CURSO

(Nada en curso. Todo lo abierto esta en BACKLOG o ASIGNADO A GEMINI.)


## HECHO

### [G-003] Que el reglamento de dos agentes se lea de verdad
- HECHO el 27/08/2026 por CLAUDE. **El problema no era que los agentes desobedecieran las
  reglas: era que nunca las veian.** `.agentes/REGLAS.md` no lo carga solo ningun agente, y
  `CLAUDE.md` (lo unico que Claude Code lee en cada sesion) no mencionaba ni el tablero, ni
  los locks, ni que existe un segundo agente. Resultado: el 27/08 dos sesiones de Claude
  trabajaron a la vez sobre esta carpeta con `.agentes/locks/` vacia.
- Que se hizo: el protocolo (locks, tablero, bitacora) ahora abre `CLAUDE.md` en la seccion
  "LEER PRIMERO", asi entra solo en toda sesion de Claude. Y se creo `AGENTS.md` en la raiz
  como puerta de entrada para cualquier otro agente, sumado al `exclude` de `_config.yml`
  para que no se publique.
- Pendiente de comprobar: si Antigravity CLI carga `AGENTS.md` por su cuenta. Si no lo hace,
  el camino sigue siendo pegarle `.agentes/PROMPT-GEMINI.md`.

### [G-002] Los documentos internos estan publicados en internet
- HECHO y **verificado en vivo el 27/08/2026** por CLAUDE. `_config.yml` (f0a1bc3) subido en
  el push `d0d27ec..e4307a5`.
- Comprobado con `curl` mirando el codigo de estado, no a ojo:
  * dan **404**: `/CLAUDE.md`, `/LEEME.md`, `/servidor-local.ps1`, `/.agentes/tablero.md`,
    `/.gitattributes`, `/.gitignore`
  * siguen dando **200**: la portada, las 10 paginas de servicio, `/sitemap.xml`,
    `/robots.txt` y `/google6f4817e7bc103d04.html`
- O sea: los documentos internos dejaron de verse y no se rompio nada del sitio.

### [A-001] Verificar que las 3 conversiones disparan de verdad
- HECHO el 26/08/2026 por CLAUDE. Resultado: **la medicion esta bien puesta**. Etiqueta y
  main.js en las 11 paginas, oyente en fase de captura, enlaces de WhatsApp con target=_blank,
  y el formulario dispara `formulario` sin contar doble. Informe completo en
  `.agentes/ads/INFORME.md`.
- Se encontro un error de documentacion en CLAUDE.md (decia que el formulario llamaba a
  'whatsapp'); corregido.
- Queda para Leandro: mirar en Google Ads que las 3 acciones figuren activas y principales.

### [G-001] Resolver los cambios sin commitear que hay en la carpeta
- objetivo: la carpeta queda limpia (`git status` sin cambios pendientes) y con el historial claro
- archivos_permitidos: los 12 ya modificados (index.html, las 10 paginas de servicio, CLAUDE.md, .gitignore)
- criterio_de_aceptacion: `git status --short` no devuelve nada y el sitio en vivo sigue igual o mejor
- notas: **PRIMERO DE TODO.** Al 26/08 hay 12 archivos modificados sin commitear. Hasta no
  resolver esto, cualquier commit de un ticket nuevo se mezcla con trabajo a medio hacer.
  Claude revisa el diff, le explica a Leandro qué es cada cambio y recién ahí commitea.
- HECHO el 26/08/2026: eran 12 archivos con el fin de linea cambiado (CRLF), sin una sola
  letra distinta. Se normalizaron a LF, se sumo .gitattributes para que no vuelva a pasar,
  y se commitearon .gitignore, .gitattributes y .agentes. Commits f445a0a y 18668be,
  todavia SIN pushear.


## DUDAS PARA LEANDRO

- ~~Los 12 archivos modificados sin commitear~~ → **resuelto el 27/08/2026.** Eran los 11 HTML
  con el fin de linea cambiado, identicos byte a byte a lo commiteado (mismo hash de blob).
  No habia nada que conservar ni nada a medias. Si `git status` te los sigue marcando como
  modificados es cosmetico: la ficha de Git quedo con el peso viejo. Se limpia con
  `git add --renormalize .`
- Plazos de entrega de los otros 9 trabajos (el del tercer eje ya está: 10 a 15 días hábiles).
  Sin ese dato no se pueden completar las páginas de servicio.
- ¿A qué página cae cada anuncio hoy? Si todo cae en la portada, conviene mandar cada grupo
  a su página de servicio: es de lo que más mueve la aguja.
