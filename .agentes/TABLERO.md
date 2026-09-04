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

(Nada asignado a Gemini por ahora.)



## EN CURSO

### [G-009] Asistente que contesta fuera de hora y termina en WhatsApp
- objetivo: que el visitante que llega a la noche o el fin de semana (el taller atiende
  lun-vie 8 a 15) tenga con quién hablar, y que la charla termine en un mensaje de
  WhatsApp completo, con trabajo y unidad
- archivos_permitidos: `asistente/` (nuevo), `assets/js/main.js`, `assets/css/styles.css`,
  los 11 `index.html` (solo si hace falta marcado), `CLAUDE.md`
- archivos_prohibidos: ninguno por ahora
- criterio_de_aceptacion: abro el sitio, toco el asistente, pregunto "¿hacen tercer eje?"
  y contesta con datos reales; le pregunto un precio y **no lo inventa**; al final me
  ofrece pasar a WhatsApp con el mensaje armado
- notas: **la clave NUNCA en el sitio.** El navegador habla con un intermediario en
  Cloudflare (dirección `.workers.dev`, sin tocar el DNS) y la clave vive ahí adentro.
  Leandro la pega él mismo en el panel de Cloudflare; ningún agente la ve ni la escribe.
  Es la **segunda excepción** a "cero recursos externos", después de la etiqueta de Ads.

## HECHO
### [G-008] Que el navegador no siga mostrando el CSS y el JS viejos
- objetivo: dejar de tener que avisar "recargá con Ctrl+F5" en cada publicación
- problema: las 11 páginas piden `styles.css` y `main.js` sin número de versión, así que
  el navegador reusa la copia guardada. Quien ya visitó el sitio puede tardar días en
  ver un cambio. Con G-007 recién publicado, es justo lo que está pasando ahora.
- archivos_permitidos: `versionar.ps1` (nuevo), los 11 `index.html`, `CLAUDE.md`
- archivos_prohibidos: `assets/css/styles.css`, `assets/js/main.js` (no se tocan)
- criterio_de_aceptacion: las 11 páginas piden `styles.css?v=XXXX`; si cambio el CSS y
  vuelvo a correr el script, el número cambia solo; si no cambié nada, queda igual
- notas: el número sale del **contenido** del archivo, no de la fecha. Con la fecha hay
  que acordarse de subirla y se olvida; con el contenido, correr el script siempre da
  el valor correcto y no ensucia el historial si no cambió nada.

### [G-007] Los botones de WhatsApp piden los datos antes de abrir el chat
- objetivo: que los mensajes que llegan al taller vengan con el trabajo y la unidad ya
  escritos, en vez de la plantilla en blanco que casi nadie completa
- problema: los 66 botones abren WhatsApp con `Trabajo que necesito:` y
  `Unidad (marca, modelo y año):` **vacíos**. La mayoría borra la plantilla y escribe
  "hola". El formulario de contacto sí arma el mensaje bien; los botones no.
- archivos_permitidos: `assets/js/main.js`, `assets/css/styles.css`
- archivos_prohibidos: los 11 HTML (el panel se arma desde el JS, no se tocan)
- criterio_de_aceptacion: toco un botón de WhatsApp, aparece un panel corto, completo la
  unidad y se abre WhatsApp con el mensaje ya redactado. Con "prefiero escribir yo" se
  abre el enlace de siempre. Sin JavaScript, todo sigue funcionando como hoy.
- notas: **no puede inflar la medición.** Hoy un oyente delegado cuenta la conversión al
  tocar el enlace; si contamos el toque y la persona abandona el panel, Google Ads
  optimiza con datos falsos. La conversión tiene que dispararse recién cuando WhatsApp
  abre de verdad.

(Nada en curso. Todo lo abierto esta en BACKLOG.)


### [G-006] El sistema de dos agentes ahora es portatil
- objetivo: que CLAUDE y GEMINI funcionen igual en otro proyecto, sin reescribir nada
- que se hizo: `delegar.ps1` dejo de tener la ruta escrita a mano (la deduce de su propia
  ubicacion) y lo propio de cada proyecto salio a `.agentes/ENCARGO.md`. `estado.ps1` ya
  aguanta proyectos sin remoto de Git y muestra bien los acentos. Se instalo todo en la
  carpeta del sistema de ordenes de trabajo, adaptado (ahi si hay dependencias, pruebas
  y compilacion).
- ademas: `trustedWorkspaces` de Gemini seguia apuntando a la carpeta vieja de OneDrive.
  Corregido; ahora lista las dos carpetas.

### [G-005] Que Claude pueda delegarle a Gemini sin intervencion de Leandro
- HECHO el 27/08/2026 por CLAUDE. Antes habia que abrir `agy` a mano y pegarle un prompt.
  Ahora: `powershell -ExecutionPolicy Bypass -File ".agentes\delegar.ps1" -Ticket A-00X`
- Tres descubrimientos que costaron encontrar:
  * En modo `-p`, `agy` **no toma la carpeta actual**: corre en un proyecto vacio y tira
    "not a git repository". Hay que pasarle `--add-dir` con la ruta completa, siempre.
  * Sus permisos de comandos son de **coincidencia literal**: permitir `git status --short`
    no permite `git status`, y los comodines (`command(git *)`) se ignoran. Precargar una
    lista de comandos es inviable.
  * Salida: `--mode accept-edits`. Gemini lee y escribe archivos sin pedir permiso pero
    **no ejecuta comandos**. Los locks los crea escribiendo el archivo, funciona igual.
    Git entero queda del lado de Claude, que es lo que REGLAS.md ya pedia.
- Probado de punta a punta: se le paso A-002 (ya HECHO), lo detecto y no toco ni un archivo.
- Los permisos de Gemini viven en `C:\Users\leand\.gemini\antigravity-cli\settings.json`,
  NO en la carpeta del proyecto. Un `.agy/settings.json` ahi adentro es inerte.

### [A-002] Que el boton de WhatsApp se vea sin scrollear en celular
- HECHO el 27/08/2026 por GEMINI.
- Que se hizo: se agrego `.wsp-float{ opacity:1; visibility:visible; transform:translateY(0) scale(1); }` dentro de `@media (max-width:900px)` en `assets/css/styles.css`.
- Comprobacion: en celular y pantallas <=900px, el boton flotante de WhatsApp (.wsp-float) arranca visible desde la carga inicial sin necesidad de scrollear; en resoluciones >900px mantiene el comportamiento previo (aparece tras 420px de scroll). No obstruye los botones principales del hero en 390px. Registrado en `.agentes/ads/CAMBIOS.md`.


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
