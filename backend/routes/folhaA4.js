const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const folhasFile = path.join(dataDir, 'folhasA4.json');

// Garantir que o arquivo existe
async function ensureFolhasFile() {
    if (!await fs.pathExists(folhasFile)) {
        await fs.writeJson(folhasFile, {});
    }
}

// GET - Obter conteúdo da folha A4 de um serviço e aba
router.get('/:servicoId/:abaNome', async (req, res) => {
    try {
        await ensureFolhasFile();
        const folhas = await fs.readJson(folhasFile);
        const key = `folhaA4_${req.params.servicoId}_${req.params.abaNome}`;
        const content = folhas[key] || null;
        res.json(content);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST - Salvar conteúdo da folha A4
router.post('/:servicoId/:abaNome', async (req, res) => {
    try {
        await ensureFolhasFile();
        const folhas = await fs.readJson(folhasFile);
        const key = `folhaA4_${req.params.servicoId}_${req.params.abaNome}`;
        folhas[key] = {
            ...req.body,
            servicoId: req.params.servicoId,
            abaNome: req.params.abaNome,
            updatedAt: new Date().toISOString()
        };
        await fs.writeJson(folhasFile, folhas, { spaces: 2 });
        res.status(201).json(folhas[key]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT - Atualizar conteúdo da folha A4
router.put('/:servicoId/:abaNome', async (req, res) => {
    try {
        await ensureFolhasFile();
        const folhas = await fs.readJson(folhasFile);
        const key = `folhaA4_${req.params.servicoId}_${req.params.abaNome}`;
        folhas[key] = {
            ...folhas[key],
            ...req.body,
            servicoId: req.params.servicoId,
            abaNome: req.params.abaNome,
            updatedAt: new Date().toISOString()
        };
        await fs.writeJson(folhasFile, folhas, { spaces: 2 });
        res.json(folhas[key]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE - Deletar conteúdo da folha A4
router.delete('/:servicoId/:abaNome', async (req, res) => {
    try {
        await ensureFolhasFile();
        const folhas = await fs.readJson(folhasFile);
        const key = `folhaA4_${req.params.servicoId}_${req.params.abaNome}`;
        delete folhas[key];
        await fs.writeJson(folhasFile, folhas, { spaces: 2 });
        res.json({ message: 'Conteúdo da folha A4 deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

