@echo off
title SISMAV - Sistema de Manutenção de Viaturas
color 0B
echo ========================================
echo   SISMAV - Iniciando Sistema
echo ========================================
echo.

cd /d "%~dp0"

REM Verificar se estamos no diretório correto
if not exist "SISMAV.html" (
    echo [ERRO] Arquivo SISMAV.html nao encontrado!
    echo.
    echo Certifique-se de que este arquivo esta na pasta correta do SISMAV.
    echo.
    pause
    exit /b 1
)

REM Verificar se Node.js está instalado
echo [1/4] Verificando Node.js...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao encontrado!
    echo.
    echo Por favor, instale o Node.js de https://nodejs.org
    echo.
    pause
    exit /b 1
) else (
    echo [OK] Node.js encontrado!
    node --version
    echo.
)

REM Verificar se backend está rodando usando PowerShell
echo [2/4] Verificando backend...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000/api/health' -TimeoutSec 2 -UseBasicParsing; exit 0 } catch { exit 1 }" >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Backend nao esta rodando. Iniciando automaticamente...
    
    REM Verificar se a pasta backend existe
    if not exist "backend" (
        echo [ERRO] Pasta backend nao encontrada!
        echo.
        pause
        exit /b 1
    )
    
    REM Verificar se server.js existe
    if not exist "backend\server.js" (
        echo [ERRO] Arquivo backend\server.js nao encontrado!
        echo.
        pause
        exit /b 1
    )
    
    REM Iniciar backend em janela minimizada
    echo [INFO] Iniciando servidor backend...
    start "SISMAV Backend" /MIN cmd /c "cd /d %~dp0backend && if not exist node_modules (call npm install) && node server.js"
    
    echo [INFO] Aguardando servidor iniciar...
    
    REM Aguardar e verificar várias vezes
    set TENTATIVAS=0
    :VERIFICAR_BACKEND
    timeout /t 2 /nobreak >nul
    powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000/api/health' -TimeoutSec 2 -UseBasicParsing; exit 0 } catch { exit 1 }" >nul 2>&1
    if %errorlevel% equ 0 (
        echo [OK] Backend iniciado com sucesso!
        goto BACKEND_OK
    ) else (
        set /a TENTATIVAS+=1
        if %TENTATIVAS% LSS 5 (
            echo [INFO] Aguardando... (tentativa %TENTATIVAS%/5)
            goto VERIFICAR_BACKEND
        ) else (
            echo [AVISO] Backend pode estar iniciando ainda. Verifique a janela "SISMAV Backend"
            echo [INFO] Continuando mesmo assim...
        )
    )
    :BACKEND_OK
    echo.
) else (
    echo [OK] Backend ja esta rodando!
    echo.
)

REM Verificar se o arquivo HTML existe
echo [3/4] Verificando arquivo SISMAV.html...
if not exist "SISMAV.html" (
    echo [ERRO] Arquivo SISMAV.html nao encontrado!
    echo.
    pause
    exit /b 1
) else (
    echo [OK] Arquivo encontrado!
    echo.
)

REM Abrir no navegador
echo [4/4] Abrindo SISMAV no navegador...
echo.

REM Tentar abrir com o navegador padrão
start "" "SISMAV.html" 2>nul
if %errorlevel% neq 0 (
    echo [AVISO] Nao foi possivel abrir automaticamente. Abra manualmente o arquivo SISMAV.html
    echo.
) else (
    echo [OK] Navegador aberto!
    echo.
)

echo ========================================
echo   Sistema iniciado!
echo ========================================
echo.
echo IMPORTANTE:
echo - O backend esta rodando em segundo plano
echo - Para parar o backend, feche a janela "SISMAV Backend"
echo - Ou execute: start-backend.bat para ver o servidor
echo.
echo Pressione qualquer tecla para fechar esta janela...
pause >nul
exit
