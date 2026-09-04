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

## HECHO
### [G-014] Voz, texto de relleno y roles de accesibilidad mal puestos
- objetivo: que la portada hable con una sola voz y que el lector de pantalla no reciba
  una estructura que no existe
- qué entra:
  1. **Tres frases en "usted"** ("su unidad") en un sitio que es de vos en todo lo demás.
     `PRODUCT.md` fija el rioplatense de vos como compromiso de marca.
  2. **El párrafo de Ubicación** es el único escrito en voz de SEO genérico ("cerca de una
     intersección principal… no dudes en visitarnos") y encima dice "tu vehículo" a gente
     que tiene camiones. Se reemplaza por qué hacer y cuándo venir.
  3. **La banda de certificaciones manda al formulario**, no a WhatsApp, que es el canal
     principal del sitio y el único que pasa por el panel de datos.
  4. **Los filtros de trabajos dicen ser pestañas** (`role="tablist"`/`role="tab"`) sin
     paneles de pestaña. Un lector de pantalla anuncia una estructura que no existe. Son
     botones de filtro: el rol honesto es `aria-pressed`.
- archivos_permitidos: `index.html`, `assets/js/main.js`
- criterio_de_aceptacion: no queda ningún "su unidad"; el párrafo de Ubicación dice algo
  útil; la banda de certificaciones abre WhatsApp; los filtros ya no se anuncian como
  pestañas
- notas: no se inventa ningún dato. La dirección y el horario ya estaban publicados.

### [G-013] Los P1 que quedaban de la crítica
- objetivo: que el camino al contacto funcione en el celular y que el horario deje de ser
  una disculpa para pasar a ser la promesa
- qué entra:
  1. **Hero de la portada**: hoy el botón rojo grande dice "Ver trabajos" y lleva a fotos.
     **Las 10 páginas de servicio ya tienen WhatsApp como principal**; la portada es la
     única que no. Se unifica.
  2. **El panel sabe la hora**: prometer "te contestamos más rápido" un sábado a las 22:40
     es falso. Fuera de las 8 a 15 de lunes a viernes cambia el texto y suma la única
     tranquilidad honesta que podemos dar sobre plazo y presupuesto.
  3. **Preloader**: esperaba al evento `load`, o sea a las 21 fotos, con red de 4500 ms.
  4. **Botón "¿Dudas?"**: medido en vivo, 42,5px de alto. El mínimo táctil es 44.
- archivos_permitidos: `index.html` (solo el hero), `assets/js/main.js`, `assets/css/styles.css`
- criterio_de_aceptacion: en el celular, el botón más grande del hero abre WhatsApp; el
  panel dice algo distinto fuera de hora; la portada pinta sin esperar las fotos; el chip
  mide 44px o más
- notas: NO se toca el rojo sobre fondo oscuro (3,8:1 medido). Es color de marca y la
  decisión es de Leandro, no mía.

### [G-012] Los tres defectos del panel de WhatsApp
- objetivo: que el panel no mande datos falsos ni pierda al visitante en silencio
- problema: los tres los introdujo G-007 y los encontró la crítica del 04/09
  1. El desplegable no marca opción, así que queda en "Colocación de 3er eje" y quien
     pasa sin abrirlo manda un trabajo equivocado. Peor que el renglón en blanco que
     vino a reemplazar: un vacío se nota, una respuesta falsa parece un dato.
  2. El enlace del pie no lleva plantilla, así que el panel no muestra el selector y el
     mensaje llega SIN trabajo.
  3. `window.open` no se verifica: si el navegador la bloquea (típico entrando desde
     Instagram), el panel se cierra, no pasa nada, y la conversión se cuenta igual.
     Google Ads optimiza hacia conversiones que nunca ocurrieron.
- archivos_permitidos: `assets/js/main.js`, `assets/css/styles.css`
- archivos_prohibidos: los 11 HTML
- criterio_de_aceptacion: el desplegable arranca en "Consulta general"; el enlace del pie
  muestra el selector; si la ventana se bloquea, el panel queda abierto con un enlace real
  y NO se cuenta la conversión
- notas: alcance acotado a los defectos por decisión de Leandro. Preseleccionar el trabajo
  desde el saludo en las 10 páginas de servicio queda como mejora, no entra acá.

### [G-011] Archivos internos que se estaban sirviendo desde el dominio
- objetivo: que solo se publique lo que es contenido del sitio
- problema: la lista de exclusión de `_config.yml` no incluía `asistente/` ni
  `versionar.ps1`, y los dos devolvían 200 en el dominio. El worker publica entero el
  texto con el que se instruye al asistente y los topes de uso: no hay claves, pero
  quien lo lee tiene el mapa para intentar saltárselo. PRODUCT.md se sumaba al problema:
  nombra el número de cuenta de Google Ads.
- archivos_permitidos: `_config.yml`
- criterio_de_aceptacion: las tres rutas devuelven 404 en el dominio, y el sitio sigue
  funcionando igual
- notas: excluir de GitHub Pages **no** los saca del repositorio. Si el repositorio es
  público, siguen siendo legibles en GitHub. Esto los quita del dominio y de los
  buscadores, que es lo que importa acá.

### [G-010] Descripciones que Google corta a la mitad
- objetivo: que el texto que aparece bajo el título en Google se lea entero, y que lo
  que sobreviva al corte sea lo que convierte: qué hacen y dónde están
- problema: Google muestra ~155 caracteres. Las 11 descripciones van de 171 a 271. La
  de la portada pierde "certificados por CENT, CNTSV y AITA. Villa Gobernador Gálvez",
  que es justo la parte que da confianza y ubica al taller.
- archivos_permitidos: los 11 `index.html` (solo las etiquetas description y
  og:description), `sitemap.xml`
- archivos_prohibidos: todo lo demás. No se toca el contenido visible de las páginas.
- criterio_de_aceptacion: las 11 descripciones quedan en 155 caracteres o menos, sin
  inventar nada que no esté ya en la página
- notas: no hay dato nuevo. Se recorta y se reordena lo que ya estaba escrito.

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
