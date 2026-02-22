const express = require('express');
const router = express.Router();
const DataManager = require('../models/DataManager');

const faturamentosManager = new DataManager('faturamentos');

// GET - Listar todos os faturamentos
router.get('/', async (req, res) => {
    try {
        const faturamentos = await faturamentosManager.getAll();
        res.json(faturamentos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Obter faturamento por ID
router.get('/:id', async (req, res) => {
    try {
        const faturamento = await faturamentosManager.getById(req.params.id);
        if (!faturamento) {
            return res.status(404).json({ error: 'Faturamento não encontrado' });
        }
        res.json(faturamento);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST - Criar novo faturamento
router.post('/', async (req, res) => {
    try {
        const faturamento = await faturamentosManager.create(req.body);
        res.status(201).json(faturamento);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT - Atualizar faturamento
router.put('/:id', async (req, res) => {
    try {
        const faturamento = await faturamentosManager.update(req.params.id, req.body);
        if (!faturamento) {
            return res.status(404).json({ error: 'Faturamento não encontrado' });
        }
        res.json(faturamento);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE - Deletar faturamento
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await faturamentosManager.delete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Faturamento não encontrado' });
        }
        res.json({ message: 'Faturamento deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;










