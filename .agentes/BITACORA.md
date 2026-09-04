# BITACORA

Una linea por movimiento. Append-only: no se edita ni se borra lo anterior.
Formato: [YYYY-MM-DD HH:MM] [CLAUDE|GEMINI] G-00X que se hizo | archivos tocados

[2026-08-26 14:30] [CLAUDE] Setup inicial: se creo .agentes con CONTEXTO, REGLAS, TABLERO, BITACORA, locks y ads | .agentes/*
[2026-08-26 14:41] [CLAUDE] G-001 hecho: normalizado fin de linea a LF en 12 archivos, sumado .gitattributes, 2 commits sin pushear | 11 html, CLAUDE.md, .gitignore, .gitattributes
[2026-08-26 14:41] [CLAUDE] Sumado circuito de consultas para Gemini navegador | .agentes/PROMPT-GEMINI-NAVEGADOR.md, .agentes/consultas/
[2026-08-26 14:48] [CLAUDE] Actualizado: el segundo agente pasa a ser Antigravity CLI (comando agy). Gemini CLI dejo de ser gratis el 18/06/2026 | .agentes/PROMPT-GEMINI.md, CONTEXTO.md, PROMPT-GEMINI-NAVEGADOR.md
[2026-08-27 08:38] [CLAUDE] Antigravity CLI instalado y logueado. El esquema completo de dos agentes entra en vigencia | .agentes/CONTEXTO.md
[2026-08-27 08:47] [CLAUDE] A-001 hecho: medicion verificada, todo correcto. Corregido error de doc en CLAUDE.md | CLAUDE.md, .agentes/ads/INFORME.md
[2026-08-27 08:47] [CLAUDE] A-002 asignado a GEMINI con archivos definidos. Nuevo G-002: los documentos internos se ven en internet | .agentes/TABLERO.md
[2026-08-27 08:51] [CLAUDE] G-002: creado _config.yml para no publicar CLAUDE.md, LEEME.md ni .agentes. Falta push y verificacion en vivo | _config.yml
[2026-08-27 08:54] [CLAUDE] Sumado .agentes/estado.ps1 para ver de un vistazo quien esta trabajando | .agentes/estado.ps1
[2026-08-27 09:06] [CLAUDE] Sumado modo economico a CLAUDE.md y prompt de mudanza fuera de OneDrive | CLAUDE.md, .agentes/PROMPT-MUDANZA.md
[2026-08-27 09:12] [CLAUDE] G-002 hecho y VERIFICADO EN VIVO: push d0d27ec..e4307a5. CLAUDE.md, LEEME.md y servidor-local.ps1 dan 404; las 11 paginas, sitemap, robots y el archivo de Search Console siguen en 200 | _config.yml
[2026-08-27 09:12] [CLAUDE] Borrados 6 archivos index.lock.viejo abandonados en .git (basura del 26/08). OneDrive sincroniza .git en caliente: ojo con eso | .git
[2026-08-27 09:12] [CLAUDE] G-003 hecho: el protocolo de dos agentes (locks, tablero, bitacora) pasa a CLAUDE.md en "LEER PRIMERO", que Claude Code carga sola en cada sesion. Sumado AGENTS.md en la raiz y excluido de la publicacion. Causa raiz: REGLAS.md no lo cargaba nadie solo | CLAUDE.md, AGENTS.md, _config.yml, .agentes/TABLERO.md
[2026-08-27 09:14] [CLAUDE] G-004 hecho: estado.ps1 contaba 0 dudas habiendo 3. El regex de seccion no exigia inicio de renglon y enganchaba la mencion a "## DUDAS PARA LEANDRO" que hay adentro del ticket A-002. Anclado con (?sm)^. Ademas se normalizaron los 11 HTML: git status quedo limpio | .agentes/estado.ps1
[2026-08-27 10:13] [GEMINI] A-002 hecho: boton flotante de WhatsApp (.wsp-float) visible por defecto en pantallas <=900px sin scrollear | assets/css/styles.css, .agentes/TABLERO.md, .agentes/ads/CAMBIOS.md

[2026-08-27 10:18] [CLAUDE] A-002 VERIFICADO en el navegador (trabajo de GEMINI, commit bc074fb). A 390x844 con recarga: opacidad 1, visible, entra completo en pantalla y no tapa nada del hero. A 1000px: opacidad 0, oculto hasta scrollear, igual que antes. Regla correctamente dentro del bloque @media (max-width:900px) (linea 1019, abre en 972 y cierra en 1020) | assets/css/styles.css
[2026-08-27 10:18] [CLAUDE] TRAMPA NUEVA del panel de previsualizacion: redimensionar NO revalua los estilos, sigue mostrando los del ancho anterior. Da lecturas falsas (medi "oculto" a 390px cuando estaba visible). Hay que RECARGAR despues de cada resize antes de medir | ninguno
[2026-08-27 10:25] [CLAUDE] G-005 hecho: creado .agentes/delegar.ps1. Claude ya puede pasarle un ticket a Gemini sin que Leandro toque nada. Claves: --add-dir obligatorio en modo -p, permisos de comando son literales (comodines ignorados), y --mode accept-edits deja editar archivos sin permisos de terminal | .agentes/delegar.ps1, .agentes/REGLAS.md, CLAUDE.md, .agentes/TABLERO.md

[2026-08-27 11:05] [CLAUDE] G-006 sistema de dos agentes portatil: delegar.ps1 generico + ENCARGO.md por proyecto, estado.ps1 aguanta repos sin remoto, instalado en el sistema de ordenes, y corregido trustedWorkspaces de Gemini que apuntaba a OneDrive | .agentes/delegar.ps1, .agentes/estado.ps1, .agentes/ENCARGO.md, .agentes/REGLAS.md, .agentes/TABLERO.md

[2026-08-27 11:37] [CLAUDE] probada la delegacion a Gemini de punta a punta en el otro proyecto: funciona, pero se deja el lock puesto. Reforzado el pedido en delegar.ps1 y anotado en REGLAS.md que Claude revise locks/ despues de cada delegacion | .agentes/delegar.ps1, .agentes/REGLAS.md

[2026-09-04 10:55] [CLAUDE] G-007 los botones de WhatsApp ahora piden trabajo y unidad antes de abrir el chat, y el mensaje llega escrito. Verificado: mensaje correcto en portada y en pagina de servicio, "prefiero escribir yo" abre el enlace de siempre, y abrir y cerrar el panel NO cuenta conversion (solo cuenta cuando WhatsApp abre de verdad) | assets/js/main.js, assets/css/styles.css
