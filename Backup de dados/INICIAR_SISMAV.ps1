# Script PowerShell para iniciar o SISMAV
Write-Host "========================================" -ForegroundColor Green
Write-Host "  SISMAV - Iniciando Sistema" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Verificar se Node.js está instalado
$nodePath = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodePath) {
    Write-Host "[ERRO] Node.js não encontrado!" -ForegroundColor Red
    Write-Host "Por favor, instale o Node.js de https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host "[1/3] Verificando dependências do backend..." -ForegroundColor Cyan
Set-Location "backend"

if (-not (Test-Path "node_modules")) {
    Write-Host "       Instalando dependências..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERRO] Falha ao instalar dependências!" -ForegroundColor Red
        Read-Host "Pressione Enter para sair"
        exit 1
    }
} else {
    Write-Host "       Dependências já instaladas." -ForegroundColor Green
}

Write-Host ""
Write-Host "[2/3] Iniciando servidor backend..." -ForegroundColor Cyan
$backendProcess = Start-Process -FilePath "node" -ArgumentList "server.js" -WindowStyle Minimized -PassThru

Start-Sleep -Seconds 3

Set-Location ..

Write-Host ""
Write-Host "[3/3] Abrindo sistema no navegador..." -ForegroundColor Cyan
$sismavPath = Join-Path $scriptPath "SISMAV.html"
Start-Process $sismavPath

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Sistema iniciado com sucesso!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "O servidor backend está rodando em segundo plano." -ForegroundColor Yellow
Write-Host "Para encerrar o servidor, feche a janela do backend." -ForegroundColor Yellow
Write-Host ""
Read-Host "Pressione Enter para sair"

