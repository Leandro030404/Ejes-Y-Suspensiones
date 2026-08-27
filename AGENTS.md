# AGENTS.md — punto de entrada para cualquier agente

Este proyecto lo trabajan **dos agentes sobre la misma carpeta y los mismos archivos**:
**CLAUDE** (Claude Code) y **GEMINI** (Antigravity CLI, comando `agy`).

Antes de tocar nada, leé en este orden:

1. **`CLAUDE.md`** — fuente de verdad del proyecto: reglas, trampas ya encontradas,
   decisiones tomadas y datos de contacto. Empieza con el protocolo de dos agentes.
2. **`.agentes/REGLAS.md`** — cómo convivimos: locks, qué comandos de Git están
   prohibidos, quién puede hacer `push`.
3. **`.agentes/TABLERO.md`** — el único canal entre los dos. **No se empieza nada que no
   esté acá como ticket.**
4. **`.agentes/BITACORA.md`** — las últimas 20 líneas, para saber qué pasó recién.

---

## Las tres reglas que más se rompen

1. **Antes de editar un archivo, creá su lock** en `.agentes/locks/` y borralo al terminar.
   Si el lock ya existe y es del otro agente, no toques ese archivo.
2. **Nunca `git add -A` ni `git add .`** — te llevás puesto el trabajo a medio hacer del
   otro agente. Siempre `git add` con las rutas exactas de tu ticket.
3. **No inventes datos.** Ni plazos de entrega, ni precios, ni especificaciones, ni
   métricas. Si falta un dato, se pide. En un informe, lo que no está se escribe "sin dato".

Para ver quién está trabajando en qué:

```
powershell -ExecutionPolicy Bypass -File ".agentes\estado.ps1"
```
