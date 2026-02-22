@echo off
title SISMAV - Modo Debug
color 0E
echo ========================================
echo   SISMAV - Modo Debug
echo ========================================
echo.

cd /d "%~dp0"

echo Diretorio atual: %CD%
echo.

echo Verificando arquivos...
if exist "SISMAV.html" (
    echo [OK] SISMAV.html encontrado
) else (
    echo [ERRO] SISMAV.html NAO encontrado
)

if exist "backend" (
    echo [OK] Pasta backend encontrada
    if exist "backend\server.js" (
        echo [OK] backend\server.js encontrado
    ) else (
        echo [ERRO] backend\server.js NAO encontrado
    )
) else (
    echo [ERRO] Pasta backend NAO encontrada
)

echo.
echo Verificando Node.js...
where node >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Node.js encontrado
    node --version
) else (
    echo [ERRO] Node.js NAO encontrado
)

echo.
echo Verificando backend...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000/api/health' -TimeoutSec 2 -UseBasicParsing; Write-Host '[OK] Backend esta rodando'; exit 0 } catch { Write-Host '[INFO] Backend nao esta rodando'; exit 1 }"

echo.
echo ========================================
echo   Pressione qualquer tecla para sair...
pause >nul










