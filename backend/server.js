const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs-extra');

// Importar rotas
const servicosRoutes = require('./routes/servicos');
const viaturasRoutes = require('./routes/viaturas');
const valoresRoutes = require('./routes/valores');
const orcamentosRoutes = require('./routes/orcamentos');
const faturamentosRoutes = require('./routes/faturamentos');
const fainasRoutes = require('./routes/fainas');
const backupRoutes = require('./routes/backup');
const folhaA4Routes = require('./routes/folhaA4');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Aumentar limite para PDFs grandes
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Servir o frontend (SISMAV.html, etc.) para Firebase/Firestore funcionar (evita timeout com file://)
const frontendDir = path.resolve(__dirname, '..');
app.use(express.static(frontendDir));

// Rotas explícitas para abrir o SISMAV pelo navegador
app.get('/', (req, res) => res.redirect('/SISMAV.html'));
app.get('/SISMAV.html', (req, res) => {
    const file = path.join(frontendDir, 'SISMAV.html');
    if (fs.existsSync(file)) {
        res.sendFile(file);
    } else {
        res.status(404).send('Arquivo SISMAV.html não encontrado em: ' + frontendDir);
    }
});

// Garantir que o diretório de dados existe
const dataDir = path.join(__dirname, 'data');
fs.ensureDirSync(dataDir);

// Rotas
app.use('/api/servicos', servicosRoutes);
app.use('/api/viaturas', viaturasRoutes);
app.use('/api/valores', valoresRoutes);
app.use('/api/orcamentos', orcamentosRoutes);
app.use('/api/faturamentos', faturamentosRoutes);
app.use('/api/fainas', fainasRoutes);
app.use('/api/backup', backupRoutes);
app.use('/api/folhaA4', folhaA4Routes);

// Rota de health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'SISMAV Backend API está funcionando',
        timestamp: new Date().toISOString()
    });
});

// Rota para obter estatísticas do armazenamento
app.get('/api/storage', async (req, res) => {
    try {
        const dataDir = path.join(__dirname, 'data');
        let totalSize = 0;
        let fileCount = 0;

        const files = await fs.readdir(dataDir);
        for (const file of files) {
            const filePath = path.join(dataDir, file);
            const stats = await fs.stat(filePath);
            if (stats.isFile()) {
                totalSize += stats.size;
                fileCount++;
            }
        }

        res.json({
            totalSize: totalSize,
            totalSizeFormatted: formatBytes(totalSize),
            fileCount: fileCount,
            limit: 10 * 1024 * 1024, // 10MB
            limitFormatted: '10 MB',
            percentual: ((totalSize / (10 * 1024 * 1024)) * 100).toFixed(2)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor SISMAV Backend rodando na porta ${PORT}`);
    console.log(`📡 Abra no navegador: http://localhost:${PORT}/ ou http://localhost:${PORT}/SISMAV.html`);
    console.log(`📡 API disponível em http://localhost:${PORT}/api`);
    console.log(`💾 Dados armazenados em: ${dataDir}`);
});










