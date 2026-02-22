const express = require('express');
const router = express.Router();
const DataManager = require('../models/DataManager');

const orcamentosManager = new DataManager('orcamentos');

// GET - Listar todos os orçamentos
router.get('/', async (req, res) => {
    try {
        const orcamentos = await orcamentosManager.getAll();
        res.json(orcamentos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Obter orçamento por ID
router.get('/:id', async (req, res) => {
    try {
        const orcamento = await orcamentosManager.getById(req.params.id);
        if (!orcamento) {
            return res.status(404).json({ error: 'Orçamento não encontrado' });
        }
        res.json(orcamento);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST - Criar novo orçamento
router.post('/', async (req, res) => {
    try {
        const orcamento = await orcamentosManager.create(req.body);
        res.status(201).json(orcamento);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT - Atualizar orçamento
router.put('/:id', async (req, res) => {
    try {
        const orcamento = await orcamentosManager.update(req.params.id, req.body);
        if (!orcamento) {
            return res.status(404).json({ error: 'Orçamento não encontrado' });
        }
        res.json(orcamento);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE - Deletar orçamento
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await orcamentosManager.delete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Orçamento não encontrado' });
        }
        res.json({ message: 'Orçamento deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;










