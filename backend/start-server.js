const { spawn } = require('child_process');
const path = require('path');

// Caminho para o servidor
const serverPath = path.join(__dirname, 'server.js');

console.log('🚀 Iniciando servidor SISMAV Backend...');

// Iniciar servidor Node.js
const server = spawn('node', [serverPath], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
});

server.on('error', (error) => {
    console.error('❌ Erro ao iniciar servidor:', error);
});

server.on('exit', (code) => {
    if (code !== 0) {
        console.error(`❌ Servidor encerrado com código ${code}`);
    }
});

// Manter o processo vivo
process.on('SIGINT', () => {
    console.log('\n🛑 Encerrando servidor...');
    server.kill();
    process.exit(0);
});
