# CONTEXTO — Trabajo con dos agentes en PAGINA EYS

> **La fuente de verdad del proyecto es `CLAUDE.md`** (raíz de la carpeta). Ahí está todo:
> estructura, reglas, trampas ya encontradas, cuenta de Google Ads, negativas, medición de
> conversiones, Search Console y pendientes. **Leelo entero antes de tocar nada.**
> Este archivo agrega solo lo que hace falta para que dos agentes trabajen a la vez.

## Lo mínimo que tenés que saber

| | |
|---|---|
| Qué es | Sitio de EyS – Ejes y Suspensiones (taller de Villa Gobernador Gálvez, Santa Fe) |
| Sitio en vivo | https://ejesysuspensiones.com.ar |
| Carpeta | `C:\Users\leand\OneDrive\Escritorio\PAGINA EYS` |
| Hosting | GitHub Pages, rama `main`, raíz. Tarda 1-3 min en actualizar |
| Repo | https://github.com/Leandro030404/Ejes-Y-Suspensiones |
| Stack | HTML/CSS/JS plano. **Sin frameworks, sin build, sin dependencias** |
| Páginas | `index.html` (portada) + 10 páginas de servicio en subcarpetas + `404.html` |
| CSS / JS | `assets/css/styles.css` · `assets/js/main.js` (un solo archivo de cada uno) |
| Previsualizar | `powershell -ExecutionPolicy Bypass -File "servidor-local.ps1"` |
| Idioma | Español rioplatense. Leandro **no es programador**: explicá el porqué, sin jerga |

## Google Ads — estado (detalle completo en CLAUDE.md)

- Cuenta **158-004-2792**, ARS 4.000/día repartidos en: "Máximo rendimiento - Sitio Web"
  (2.500/día, creada el 24/08, **en aprendizaje: no tocar hasta el 7/09**),
  "Búsqueda - Sitio Web" (1.500/día, casi no gasta) y "Ejes Y Suspensiones" (**detenida**).
- Etiqueta instalada: **AW-18384322870**, en el `<head>` de las 11 páginas.
- Tres conversiones activas y marcadas como principales: **clic en WhatsApp**,
  **clic en teléfono** y **envío del formulario**. El código es un oyente delegado al final
  de `assets/js/main.js` — cubre los 66 enlaces de WhatsApp sin tocar el HTML uno por uno.
- Lista compartida de negativas **"Negativas EyS"** (30 palabras) aplicada a las 3 campañas.
- Contexto histórico importante: los números del 11 al 20 de agosto están **contaminados**
  (la ficha de Google decía "Taller de automóviles" en esos días). No compares contra eso.

## Cómo se reparte el trabajo

- **CLAUDE** = arquitecto y líder. Decide, parte el trabajo en tickets, analiza las campañas,
  revisa lo que hace Gemini y es el único que hace `git push`.
- **GEMINI** = ejecutor. Toma tickets del TABLERO y los implementa, solo dentro de los
  archivos que el ticket le permite.
- **LEANDRO** = ejecuta a mano los cambios dentro de la cuenta de Google Ads. Ninguna IA
  toca presupuestos, pujas ni anuncios.

## Archivos de coordinación (esta carpeta)

| Archivo | Para qué |
|---|---|
| `CONTEXTO.md` | este archivo |
| `REGLAS.md` | **obligatorio**: cómo no pisarse. Leerlo antes de editar |
| `TABLERO.md` | el único canal entre los dos agentes: tickets y estado |
| `BITACORA.md` | quién hizo qué y cuándo (append-only) |
| `locks/` | un archivo `.lock` por archivo que alguien está editando |
| `ads/exports/` | acá deja Leandro los CSV que baja de Google Ads |
| `ads/INFORME.md` | último análisis de campañas |
| `ads/HISTORIAL.md` | métricas por fecha, para comparar revisión contra revisión |
| `ads/CAMBIOS.md` | qué se cambió y cuándo, para medir el antes y el después |

## Nota sobre el segundo agente (actualizado 26/08/2026)

El segundo agente es **Antigravity CLI** (comando `agy`, instalado el 26/08/2026 — Gemini CLI
dejó de ser gratis el 18/06/2026). Corre en su propia terminal sobre esta misma carpeta y
firma como **GEMINI** en el TABLERO y en la BITÁCORA. **El esquema completo está en vigencia:**
tickets, locks y reglas de no pisarse valen desde ya.

Recordá que su plan gratuito tiene límites semanales de uso. Si un día se queda sin cupo, no
está roto: Claude sigue solo y los tickets pendientes quedan en el TABLERO.

Además existe un circuito aparte para **Gemini del navegador**, útil como consultor externo
para textos de anuncios y segundas opiniones sobre el análisis de campañas: Claude escribe
`.agentes\consultas\C-00X-consulta.md` (autocontenido) → Leandro lo pega en Gemini → pega la
respuesta en `C-00X-respuesta.md` → Claude la evalúa e implementa. Detalle en
`.agentes\PROMPT-GEMINI-NAVEGADOR.md`. Es opcional y no reemplaza a nada.
