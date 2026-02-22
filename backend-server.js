/**
 * Script para iniciar o backend automaticamente quando o SISMAV for aberto
 * Este arquivo será executado via Node.js a partir do navegador
 */

const { spawn, exec } = require('child_process');
const path = require('path');
const http = require('http');

const BACKEND_PORT = 3000;
const BACKEND_DIR = path.join(__dirname, 'backend');
const SERVER_FILE = path.join(BACKEND_DIR, 'server.js');

let serverProcess = null;

// Verificar se o servidor já está rodando
function checkServerRunning() {
    return new Promise((resolve) => {
        const req = http.get(`http://localhost:${BACKEND_PORT}/api/health`, (res) => {
            resolve(true);
        });
        
        req.on('error', () => {
            resolve(false);
        });
        
        req.setTimeout(1000, () => {
            req.destroy();
            resolve(false);
        });
    });
}

// Instalar dependências se necessário
function installDependencies() {
    return new Promise((resolve, reject) => {
        console.log('📦 Verificando dependências...');
        
        exec('npm list --depth=0', { cwd: BACKEND_DIR }, (error) => {
            if (error) {
                console.log('📥 Instalando dependências...');
                const install = spawn('npm', ['install'], {
                    cwd: BACKEND_DIR,
                    stdio: 'inherit',
                    shell: true
                });
                
                install.on('close', (code) => {
                    if (code === 0) {
                        console.log('✅ Dependências instaladas!');
                        resolve();
                    } else {
                        reject(new Error('Falha ao instalar dependências'));
                    }
                });
            } else {
                console.log('✅ Dependências já instaladas');
                resolve();
            }
        });
    });
}

// Iniciar servidor
async function startServer() {
    try {
        // Verificar se já está rodando
        const isRunning = await checkServerRunning();
        if (isRunning) {
            console.log('✅ Servidor já está rodando!');
            return;
        }

        // Instalar dependências se necessário
        await installDependencies();

        // Iniciar servidor
        console.log('🚀 Iniciando servidor backend...');
        serverProcess = spawn('node', [SERVER_FILE], {
            cwd: BACKEND_DIR,
            stdio: 'inherit',
            shell: true,
            detached: false
        });

        serverProcess.on('error', (error) => {
            console.error('❌ Erro ao iniciar servidor:', error);
        });

        serverProcess.on('exit', (code) => {
            if (code !== 0 && code !== null) {
                console.error(`❌ Servidor encerrado com código ${code}`);
            }
        });

        // Aguardar servidor iniciar
        await new Promise((resolve) => {
            const checkInterval = setInterval(async () => {
                const running = await checkServerRunning();
                if (running) {
                    clearInterval(checkInterval);
                    console.log('✅ Servidor backend iniciado com sucesso!');
                    resolve();
                }
            }, 500);
            
            // Timeout de 10 segundos
            setTimeout(() => {
                clearInterval(checkInterval);
                resolve();
            }, 10000);
        });

    } catch (error) {
        console.error('❌ Erro ao iniciar backend:', error);
    }
}

// Iniciar quando o script for executado
if (require.main === module) {
    startServer();
}

module.exports = { startServer, checkServerRunning };










