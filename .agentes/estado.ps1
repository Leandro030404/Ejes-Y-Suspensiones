# Estado del trabajo de los dos agentes en PAGINA EYS
# Uso:  powershell -ExecutionPolicy Bypass -File ".agentes\estado.ps1"
# Sin acentos a proposito: PowerShell 5.1 lee los .ps1 como ANSI y los rompe.

$raiz = Split-Path -Parent $PSScriptRoot
Set-Location $raiz

function Titulo($t) {
  Write-Host ""
  Write-Host ("=" * 62) -ForegroundColor DarkGray
  Write-Host "  $t" -ForegroundColor Cyan
  Write-Host ("=" * 62) -ForegroundColor DarkGray
}

Titulo "QUIEN ESTA TRABAJANDO AHORA"
$locks = Get-ChildItem ".agentes\locks\*.lock" -ErrorAction SilentlyContinue
if (-not $locks) {
  Write-Host "  Nadie. No hay ningun archivo bloqueado." -ForegroundColor Green
} else {
  foreach ($l in $locks) {
    $quien = (Get-Content $l.FullName -First 1)
    $mins  = [int]((Get-Date) - $l.LastWriteTime).TotalMinutes
    $color = if ($mins -gt 120) { "Red" } else { "Yellow" }
    Write-Host ("  {0,-34} {1}  (hace {2} min)" -f $l.BaseName, $quien, $mins) -ForegroundColor $color
  }
  if ($locks | Where-Object { ((Get-Date) - $_.LastWriteTime).TotalMinutes -gt 120 }) {
    Write-Host ""
    Write-Host "  OJO: hay locks de mas de 2 horas. Puede ser un lock olvidado." -ForegroundColor Red
  }
}

Titulo "ULTIMOS MOVIMIENTOS"
if (Test-Path ".agentes\BITACORA.md") {
  Get-Content ".agentes\BITACORA.md" | Where-Object { $_ -match "^\[" } |
    Select-Object -Last 8 | ForEach-Object {
      $color = if ($_ -match "\[GEMINI\]") { "Magenta" } else { "White" }
      Write-Host "  $_" -ForegroundColor $color
    }
}

Titulo "TABLERO"
if (Test-Path ".agentes\TABLERO.md") {
  $txt = Get-Content ".agentes\TABLERO.md" -Raw
  foreach ($sec in @("BACKLOG","ASIGNADO A GEMINI","EN CURSO","HECHO","DUDAS PARA LEANDRO")) {
    $m = [regex]::Match($txt, "(?sm)^##\s+$([regex]::Escape($sec))(.*?)(?=\r?\n##\s|\z)")
    $cuerpo = if ($m.Success) { $m.Groups[1].Value } else { "" }
    $n = ([regex]::Matches($cuerpo, "(?m)^###\s")).Count
    if ($sec -eq "DUDAS PARA LEANDRO") { $n = ([regex]::Matches($cuerpo, "(?m)^-\s")).Count }
    $color = if ($sec -eq "ASIGNADO A GEMINI" -and $n -gt 0) { "Yellow" }
             elseif ($sec -eq "DUDAS PARA LEANDRO" -and $n -gt 0) { "Red" }
             else { "Gray" }
    Write-Host ("  {0,-22} {1}" -f $sec, $n) -ForegroundColor $color
  }
}

Titulo "GIT"
$cambios = git status --short 2>$null
if ($cambios) {
  Write-Host "  Archivos tocados y sin commitear:" -ForegroundColor Yellow
  $cambios | ForEach-Object { Write-Host "    $_" }
} else {
  Write-Host "  Todo commiteado." -ForegroundColor Green
}
$sinSubir = git log origin/main..HEAD --oneline 2>$null
if ($sinSubir) {
  Write-Host ""
  Write-Host ("  {0} commit(s) sin subir a GitHub. Corre: git push" -f @($sinSubir).Count) -ForegroundColor Yellow
  $sinSubir | ForEach-Object { Write-Host "    $_" -ForegroundColor DarkGray }
} else {
  Write-Host "  Nada pendiente de subir." -ForegroundColor Green
}
Write-Host ""
