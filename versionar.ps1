# versionar.ps1 - Le pone numero de version al CSS y al JS en las 11 paginas.
#
#   powershell -ExecutionPolicy Bypass -File "versionar.ps1"
#
# Por que existe: las paginas pedian styles.css y main.js "a secas", asi que el
# navegador reusaba la copia que ya tenia guardada. Quien ya habia visitado el
# sitio podia tardar dias en ver un cambio, y habia que avisarle que recargara
# con Ctrl+F5. Agregandole ?v=XXXX el navegador se da cuenta solo.
#
# El numero sale del CONTENIDO del archivo, no de la fecha: correr el script
# siempre da el valor correcto, y si no cambio nada no ensucia el historial.
#
# Correlo antes de publicar, cada vez que hayas tocado el CSS o el JS.
#
# Sin acentos a proposito: PowerShell 5.1 lee los .ps1 como ANSI y los rompe.

$raiz = $PSScriptRoot
Set-Location $raiz

function Firma($ruta) {
  if (-not (Test-Path $ruta)) { return $null }
  $bytes = [System.IO.File]::ReadAllBytes($ruta)
  $sha   = [System.Security.Cryptography.SHA1]::Create()
  return ([System.BitConverter]::ToString($sha.ComputeHash($bytes)) -replace '-','').Substring(0,8).ToLower()
}

$vCss = Firma (Join-Path $raiz 'assets\css\styles.css')
$vJs  = Firma (Join-Path $raiz 'assets\js\main.js')

if (-not $vCss -or -not $vJs) {
  Write-Host "ERROR: no encuentro assets\css\styles.css o assets\js\main.js" -ForegroundColor Red
  exit 1
}

Write-Host ""
Write-Host "  styles.css -> v=$vCss" -ForegroundColor Cyan
Write-Host "  main.js    -> v=$vJs"  -ForegroundColor Cyan
Write-Host ""

$paginas = @(Get-ChildItem -Path $raiz -Filter 'index.html' -File) +
           @(Get-ChildItem -Path $raiz -Directory |
             Where-Object { $_.Name -notmatch '^(assets|_originales|\.|node_modules)' } |
             ForEach-Object { Get-ChildItem -Path $_.FullName -Filter 'index.html' -File -ErrorAction SilentlyContinue })

$cambiadas = 0
$sinCambio = 0

foreach ($p in $paginas) {
  $enc  = New-Object System.Text.UTF8Encoding($false)
  $txt  = [System.IO.File]::ReadAllText($p.FullName, $enc)
  $orig = $txt

  # Reemplaza la referencia tenga o no un ?v= viejo
  $txt = [regex]::Replace($txt, '(assets/css/styles\.css)(\?v=[a-z0-9]+)?', "`$1?v=$vCss")
  $txt = [regex]::Replace($txt, '(assets/js/main\.js)(\?v=[a-z0-9]+)?',    "`$1?v=$vJs")

  if ($txt -ne $orig) {
    [System.IO.File]::WriteAllText($p.FullName, $txt, $enc)
    $rel = $p.FullName.Substring($raiz.Length).TrimStart('\')
    Write-Host ("  actualizada  {0}" -f $rel) -ForegroundColor Green
    $cambiadas++
  } else {
    $sinCambio++
  }
}

Write-Host ""
if ($cambiadas -eq 0) {
  Write-Host "  Nada que hacer: las $sinCambio paginas ya estaban al dia." -ForegroundColor Green
} else {
  Write-Host "  Listo: $cambiadas pagina(s) actualizada(s), $sinCambio ya estaban al dia." -ForegroundColor Green
}
Write-Host ""
