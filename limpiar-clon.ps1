# Documento generado el 2026-07-04-2016
#
# limpiar-clon.ps1
# Deja el clon de generador-dungeon listo para empezar Blood Bowl:
# conserva la fontaneria (stack, CI, deploy, configs) y BORRA el dominio de D&D.
#
# BORRA de forma definitiva el dominio de D&D. Asegurate de tener una copia.
# NO toca: .git, node_modules, ni ningun fichero de configuracion/plumbing.
#
# USO (desde la raiz del repo, en PowerShell):
#   1) Simulacion (no borra nada, solo muestra):  powershell -ExecutionPolicy Bypass -File .\limpiar-clon.ps1
#   2) Borrar de verdad:                          powershell -ExecutionPolicy Bypass -File .\limpiar-clon.ps1 -Execute

param(
    [switch]$Execute
)

$ErrorActionPreference = 'Stop'

# --- Raiz del repo = carpeta donde esta este script ---
$repo = $PSScriptRoot
if (-not $repo) { $repo = (Get-Location).Path }

# --- Comprobacion de seguridad: parece el proyecto correcto? ---
if (-not (Test-Path (Join-Path $repo 'package.json'))) {
    Write-Host "ERROR: no encuentro package.json en '$repo'." -ForegroundColor Red
    Write-Host "Coloca este script en la raiz del repo y ejecutalo desde ahi." -ForegroundColor Red
    exit 1
}

# =====================================================================
#  QUE SE BORRA (dominio de D&D)  vs  QUE SE QUEDA (fontaneria)
# =====================================================================

# Ficheros sueltos de la raiz que son de D&D o basura de sesion.
$delFiles = @(
    'ANALISIS_TECNICO.md',        # audit de generador-dungeon
    'FUNCIONALIDADES_FUTURAS.md', # roadmap de generador-dungeon
    'CLAUDE.md',                  # instrucciones de proyecto de D&D (se reescribe)
    'changelog.txt',              # 289 KB de historial de D&D (se recrea vacio)
    'README.md',                  # readme de D&D (se reescribe)
    'dev.log.txt',                # log de desarrollo obsoleto
    'dir.txt',                    # el listado que generaste
    'public\sci-report.json'      # datos del "sci report" de D&D
)

# Carpetas completas de dominio.
$delDirs = @(
    'src',                        # app entera de D&D (se recrea vacia)
    'scripts',                    # scripts de PDF / indices / benchmark de D&D
    'public\characters',          # personajes de ejemplo de D&D
    'public\pdf'                  # plantillas PDF (dnd, 5e, brancalonia, apocalisse)
)

# Lo que se QUEDA (para tu referencia; el script no lo toca):
#   .git .github .gitignore LICENSE lighthouserc.json
#   tsconfig*.json vite.config.ts vitest.config.ts
#   package.json package-lock.json index.html node_modules
#   arrancar.bat instalar.bat subir.bat
#   docs\ (vacia, para el manual)
#   public\: .nojekyll 404.html favicon.svg logo.png manifest.json
#            og-image.svg pwa-192x192.svg pwa-512x512.svg robots.txt
#            sitemap.xml vite.svg   (re-skin/editar, no borrar)

# --- Construir la lista real de items existentes a borrar ---
$items = @()
foreach ($f in $delFiles) {
    $p = Join-Path $repo $f
    if (Test-Path $p) { $items += [pscustomobject]@{ Rel = $f; Path = $p; Type = 'archivo' } }
}
foreach ($d in $delDirs) {
    $p = Join-Path $repo $d
    if (Test-Path $p) { $items += [pscustomobject]@{ Rel = $d; Path = $p; Type = 'carpeta' } }
}

# =====================================================================
#  MODO SIMULACION
# =====================================================================
if (-not $Execute) {
    Write-Host ""
    Write-Host "=== SIMULACION (no se borra nada) ===" -ForegroundColor Cyan
    Write-Host "Repo: $repo"
    Write-Host ""
    Write-Host "Se BORRARIAN estos elementos:" -ForegroundColor Yellow
    if ($items.Count -eq 0) {
        Write-Host "  (nada: ya esta limpio)"
    } else {
        foreach ($i in $items) { Write-Host ("  [{0}] {1}" -f $i.Type, $i.Rel) }
    }
    Write-Host ""
    Write-Host "NO se tocarian: .git, node_modules, ni la fontaneria (configs, CI, .bat, docs, resto de public)." -ForegroundColor Green
    Write-Host ""
    Write-Host "Para borrar de verdad:" -ForegroundColor Cyan
    Write-Host "  powershell -ExecutionPolicy Bypass -File .\limpiar-clon.ps1 -Execute"
    Write-Host ""
    exit 0
}

# =====================================================================
#  EJECUCION REAL (BORRADO)
# =====================================================================
if ($items.Count -eq 0) {
    Write-Host "No hay nada de dominio D&D que borrar. El repo ya esta limpio." -ForegroundColor Green
    exit 0
}

Write-Host ""
Write-Host "Se van a BORRAR DEFINITIVAMENTE $($items.Count) elementos:" -ForegroundColor Red
foreach ($i in $items) { Write-Host ("  [{0}] {1}" -f $i.Type, $i.Rel) -ForegroundColor DarkGray }
Write-Host ""
$confirm = Read-Host "Esto no se puede deshacer. Escribe BORRAR para continuar"
if ($confirm -ne 'BORRAR') {
    Write-Host "Cancelado. No se ha tocado nada." -ForegroundColor Red
    exit 0
}

$done = 0
foreach ($i in $items) {
    Remove-Item -LiteralPath $i.Path -Recurse -Force
    Write-Host ("  borrado: {0}" -f $i.Rel) -ForegroundColor DarkGray
    $done++
}

# Recrear estructura minima vacia para que el proyecto no quede descabezado.
New-Item -ItemType Directory -Path (Join-Path $repo 'src') -Force | Out-Null

# changelog.txt vacio con cabecera (tu convencion: una entrada por cambio).
$chLog = Join-Path $repo 'changelog.txt'
"# changelog Blood Bowl: Rise to Glory" | Out-File -FilePath $chLog -Encoding UTF8

Write-Host ""
Write-Host "Hecho. Borrados $done elementos." -ForegroundColor Green
Write-Host ""
Write-Host "PENDIENTE (a mano / en la sesion de despliegue):" -ForegroundColor Cyan
Write-Host "  - .git aun apunta al repo de D&D: corrige el remote (o re-inicia git) antes de hacer push."
Write-Host "  - vite.config.ts: cambia el base path (era /dnd-character-builder/)."
Write-Host "  - package.json: nombre del proyecto + quita dependencias solo de D&D (p.ej. pdf-lib)."
Write-Host "  - index.html, public\manifest.json, robots.txt, sitemap.xml: titulo/URLs de D&D."
Write-Host "  - public: logo.png, favicon.svg, og-image.svg, iconos pwa: re-skin para Blood Bowl."
Write-Host "  - .github\workflows\deploy.yaml: revisa base path / nombre de repo."
Write-Host "  - arrancar.bat / subir.bat: revisan URL y ruta del proyecto de D&D."
Write-Host ""
