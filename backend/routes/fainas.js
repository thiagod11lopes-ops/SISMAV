const express = require('express');
const router = express.Router();
const DataManager = require('../models/DataManager');

const fainasManager = new DataManager('fainas');

// GET - Listar todas as fainas
router.get('/', async (req, res) => {
    try {
        const fainas = await fainasManager.getAll();
        res.json(fainas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Obter faina por ID
router.get('/:id', async (req, res) => {
    try {
        const faina = await fainasManager.getById(req.params.id);
        if (!faina) {
            return res.status(404).json({ error: 'Faina não encontrada' });
        }
        res.json(faina);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST - Criar nova faina
router.post('/', async (req, res) => {
    try {
        const faina = await fainasManager.create(req.body);
        res.status(201).json(faina);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT - Atualizar faina
router.put('/:id', async (req, res) => {
    try {
        const faina = await fainasManager.update(req.params.id, req.body);
        if (!faina) {
            return res.status(404).json({ error: 'Faina não encontrada' });
        }
        res.json(faina);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE - Deletar faina
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await fainasManager.delete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Faina não encontrada' });
        }
        res.json({ message: 'Faina deletada com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;










