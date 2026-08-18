# ═══════════════════════════════════════════════════════════
#  EyS · Ejes y Suspensiones — Servidor local de prueba
#
#  Sirve la web en http://localhost:8765 para verla como se
#  verá en internet (abriendo index.html directamente algunos
#  navegadores bloquean el CSS y el JS por seguridad).
#
#  Uso:  clic derecho sobre este archivo → "Ejecutar con PowerShell"
#        o desde una terminal:  .\servidor-local.ps1
#
#  Para detenerlo: Ctrl + C
# ═══════════════════════════════════════════════════════════

param([int]$Port = 8765)

$Root = $PSScriptRoot

$types = @{
  '.html'='text/html; charset=utf-8'; '.css'='text/css; charset=utf-8'; '.js'='application/javascript; charset=utf-8'
  '.jpg'='image/jpeg'; '.jpeg'='image/jpeg'; '.png'='image/png'; '.svg'='image/svg+xml'; '.ico'='image/x-icon'
  '.webp'='image/webp'; '.json'='application/json; charset=utf-8'; '.woff2'='font/woff2'; '.txt'='text/plain; charset=utf-8'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")

try { $listener.Start() }
catch { Write-Host "No se pudo abrir el puerto $Port. Probá con: .\servidor-local.ps1 -Port 8080" -ForegroundColor Red; exit 1 }

Write-Host ""
Write-Host "  EyS - Ejes y Suspensiones" -ForegroundColor Red
Write-Host "  Sitio disponible en: http://localhost:$Port/" -ForegroundColor Green
Write-Host "  (Ctrl + C para detener)" -ForegroundColor DarkGray
Write-Host ""

Start-Process "http://localhost:$Port/"

while ($listener.IsListening) {
  try {
    $ctx  = $listener.GetContext()
    $path = [System.Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath)
    if ($path -eq '/' -or $path -eq '') { $path = '/index.html' }
    $file = Join-Path $Root ($path.TrimStart('/') -replace '/', '\')

    # Igual que GitHub Pages: si la ruta es una carpeta, servir su index.html
    if (Test-Path -LiteralPath $file -PathType Container) {
      $file = Join-Path $file 'index.html'
    }

    if (Test-Path -LiteralPath $file -PathType Leaf) {
      $ext   = [System.IO.Path]::GetExtension($file).ToLower()
      $ct    = $types[$ext]; if (-not $ct) { $ct = 'application/octet-stream' }
      $bytes = [System.IO.File]::ReadAllBytes($file)
      $ctx.Response.ContentType    = $ct
      $ctx.Response.ContentLength64 = $bytes.Length
      $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $ctx.Response.StatusCode = 404
      $msg = [System.Text.Encoding]::UTF8.GetBytes("404 - No encontrado: $path")
      $ctx.Response.OutputStream.Write($msg, 0, $msg.Length)
    }
    $ctx.Response.OutputStream.Close()
  } catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor DarkYellow
  }
}
