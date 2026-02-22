@echo off
echo ========================================
echo   SISMAV Backend - Iniciando Servidor
echo ========================================
echo.

cd /d "%~dp0"

if not exist "node_modules" (
    echo Instalando dependencias...
    call npm install
    echo.
)

echo Iniciando servidor na porta 3000...
echo.
node server.js

pause










