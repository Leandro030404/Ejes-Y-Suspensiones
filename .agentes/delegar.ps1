# delegar.ps1 - Le pasa un ticket a GEMINI (Antigravity CLI) sin tener que pegar nada.
#
#   powershell -ExecutionPolicy Bypass -File ".agentes\delegar.ps1" -Ticket A-002
#
# Este script es GENERICO: sirve igual en cualquier proyecto. La carpeta la deduce
# solo (es la que contiene a .agentes) y lo propio de cada proyecto lo lee de
# .agentes\ENCARGO.md. Para llevarlo a otro proyecto se copia tal cual y se escribe
# un ENCARGO.md nuevo.
#
# Por que existe: en modo automatico (-p) agy NO toma la carpeta actual, hay que
# pasarle --add-dir. Y sus permisos de comandos son de coincidencia LITERAL (permitir
# "git status --short" no permite "git status"), asi que precargarlos es inviable.
# La salida es --mode accept-edits: Gemini lee y escribe archivos sin pedir permiso,
# pero NO ejecuta comandos. Por eso Git queda del lado de Claude, que es lo que el
# reglamento ya pedia.

param(
  [Parameter(Mandatory=$true)][string]$Ticket,
  [int]$MinutosMax = 10
)

$carpeta = Split-Path -Parent $PSScriptRoot
$encargoPath = Join-Path $PSScriptRoot "ENCARGO.md"

if (-not (Test-Path $encargoPath)) {
  Write-Host "ERROR: falta $encargoPath" -ForegroundColor Red
  Write-Host "Ese archivo describe el proyecto y sus reglas. Sin el, Gemini no sabe donde esta parado." -ForegroundColor Red
  exit 1
}

$encargo = [System.IO.File]::ReadAllText($encargoPath, [System.Text.Encoding]::UTF8)

$pedido = @"
Sos el AGENTE EJECUTOR de este proyecto.
Carpeta: $carpeta

Antes de tocar nada, lee en este orden: AGENTS.md, CLAUDE.md, .agentes/REGLAS.md y
.agentes/TABLERO.md.

TU TAREA: hace el ticket $Ticket del TABLERO. Respeta al pie de la letra sus
archivos_permitidos y archivos_prohibidos. Si el ticket no existe o ya figura en HECHO,
no hagas nada y decilo.

IMPORTANTE - en este modo NO podes ejecutar comandos de terminal, solo leer y escribir
archivos. Entonces:

1. El lock lo creas ESCRIBIENDO el archivo .agentes/locks/<ruta-con-guiones>.lock
   (una linea adentro: GEMINI - $Ticket - fecha y hora).
   **BORRALO VOS ANTES DE TERMINAR, no se lo dejes a Claude.** Un lock olvidado le
   traba el trabajo al otro agente. Si tu modo no te deja borrar archivos, escribi
   adentro del lock la palabra LIBRE y decilo en el resumen.
   Si ya existe uno de CLAUDE para ese archivo, no lo toques y avisa.
2. NO intentes correr git, ni npm, ni pruebas. De eso se encarga CLAUDE.
3. Al terminar: anota una linea en .agentes/BITACORA.md y move el ticket a la seccion
   HECHO en .agentes/TABLERO.md.
4. Cerra con un resumen de 3 renglones: que archivos tocaste, que cambiaste y que
   tendria que verificar Claude.

Si falta un dato, escribilo en la seccion DUDAS PARA LEANDRO del TABLERO en vez de
adivinar. Nunca inventes datos.

--- CONTEXTO Y REGLAS DE ESTE PROYECTO EN PARTICULAR ---

$encargo
"@

Write-Host "Delegando el ticket $Ticket a GEMINI..." -ForegroundColor Cyan
Write-Host "Proyecto: $carpeta" -ForegroundColor DarkGray
Write-Host "(hasta $MinutosMax minutos; Git y la verificacion quedan para Claude)" -ForegroundColor DarkGray
Write-Host ""

& agy -p $pedido --mode accept-edits --add-dir $carpeta --print-timeout "$($MinutosMax)m"

Write-Host ""
Write-Host "Listo. Ahora pedile a Claude que revise, verifique y publique." -ForegroundColor Green
