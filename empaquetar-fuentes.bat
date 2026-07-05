@echo off
setlocal

for /f %%I in ('powershell -NoProfile -Command "Get-Date -Format yyyyMMdd"') do set FECHA=%%I
set NOMBRE=bbrtg-src-%FECHA%.zip

echo.
echo  Blood Bowl: Rise to Glory - Empaquetador de codigo fuente
echo  Destino: %NOMBRE%
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command "$files = 'src','.github','CLAUDE.md','changelog.txt','DOCUMENTACION.html','package.json','vite.config.ts','index.html','tsconfig.json','tsconfig.app.json','tsconfig.node.json'; $ok = $files | Where-Object { Test-Path $_ }; Compress-Archive -Path $ok -DestinationPath '%NOMBRE%' -Force; $kb = [math]::Round((Get-Item '%NOMBRE%').Length / 1KB); Write-Host '  ZIP listo:' '%NOMBRE%' '(' $kb 'KB)'"

if errorlevel 1 (
    echo ERROR: no se pudo crear el ZIP.
    pause
    exit /b 1
)

echo.
echo  Para continuar en Claude:
echo  1. Abre claude.ai/code
echo  2. Adjunta %NOMBRE%
echo  3. Si el manual cambio, adjuntalo tambien (docs\*.md)
echo  4. Pega el contenido de CLAUDE.md como primer mensaje
echo.
pause
