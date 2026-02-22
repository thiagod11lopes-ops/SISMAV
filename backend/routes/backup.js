const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');

// GET - Fazer backup completo de todos os dados
router.get('/export', async (req, res) => {
    try {
        const dataDir = path.join(__dirname, '..', 'data');
        const files = await fs.readdir(dataDir);
        const backup = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            data: {}
        };

        for (const file of files) {
            if (file.endsWith('.json')) {
                const filePath = path.join(dataDir, file);
                const data = await fs.readFile(filePath, 'utf8');
                const key = file.replace('.json', '');
                backup.data[key] = JSON.parse(data);
            }
        }

        res.json(backup);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST - Importar backup completo
router.post('/import', async (req, res) => {
    try {
        const backup = req.body;
        const dataDir = path.join(__dirname, '..', 'data');

        if (!backup.data) {
            return res.status(400).json({ error: 'Formato de backup inválido' });
        }

        for (const [key, value] of Object.entries(backup.data)) {
            const filePath = path.join(dataDir, `${key}.json`);
            await fs.writeFile(filePath, JSON.stringify(value, null, 2));
        }

        res.json({ message: 'Backup importado com sucesso', importedKeys: Object.keys(backup.data) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE - Limpar todos os dados
router.delete('/clear', async (req, res) => {
    try {
        const dataDir = path.join(__dirname, '..', 'data');
        const files = await fs.readdir(dataDir);
        
        for (const file of files) {
            if (file.endsWith('.json')) {
                const filePath = path.join(dataDir, file);
                await fs.writeFile(filePath, JSON.stringify([], null, 2));
            }
        }

        res.json({ message: 'Todos os dados foram limpos' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;










