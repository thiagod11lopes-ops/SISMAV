@echo off
title SISMAV Backend Server
color 0A
echo ========================================
echo   SISMAV Backend - Iniciando Servidor
echo ========================================
echo.

cd /d "%~dp0backend"

REM Verificar se Node.js está instalado
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao encontrado!
    echo Por favor, instale o Node.js de https://nodejs.org
    echo.
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo [1/2] Instalando dependencias...
    call npm install
    if errorlevel 1 (
        echo.
        echo ERRO: Falha ao instalar dependencias!
        pause
        exit /b 1
    )
    echo.
) else (
    echo [1/2] Dependencias ja instaladas
    echo.
)

echo [2/2] Iniciando servidor na porta 3000...
echo.
echo ========================================
echo   Servidor rodando em http://localhost:3000
echo ========================================
echo.
echo IMPORTANTE: Mantenha esta janela aberta!
echo Para parar o servidor, feche esta janela ou pressione Ctrl+C
echo.
echo ========================================
echo.

node server.js

if errorlevel 1 (
    echo.
    echo ERRO: Falha ao iniciar servidor!
    pause
    exit /b 1
)
