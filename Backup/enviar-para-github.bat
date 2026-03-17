@echo off
cd /d "%~dp0"
echo Adicionando alteracoes...
git add SISMAV.html
git add .
echo Fazendo commit...
git commit -m "Adicionar Restaurar do Firebase - recuperar dados em qualquer computador"
echo Enviando para o GitHub...
git push origin main
echo.
echo Pronto. Aguarde 2-5 min e teste: https://thiagod11lopes-ops.github.io/SISMAV/
pause
