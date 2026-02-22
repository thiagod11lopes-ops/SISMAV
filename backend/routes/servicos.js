const express = require('express');
const router = express.Router();
const DataManager = require('../models/DataManager');

const servicosManager = new DataManager('manutencoesCadastradas');

// GET - Listar todos os serviços
router.get('/', async (req, res) => {
    try {
        const servicos = await servicosManager.getAll();
        res.json(servicos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Obter serviço por ID
router.get('/:id', async (req, res) => {
    try {
        const servico = await servicosManager.getById(req.params.id);
        if (!servico) {
            return res.status(404).json({ error: 'Serviço não encontrado' });
        }
        res.json(servico);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST - Criar novo serviço
router.post('/', async (req, res) => {
    try {
        const servico = await servicosManager.create(req.body);
        res.status(201).json(servico);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT - Atualizar serviço
router.put('/:id', async (req, res) => {
    try {
        const servico = await servicosManager.update(req.params.id, req.body);
        if (!servico) {
            return res.status(404).json({ error: 'Serviço não encontrado' });
        }
        res.json(servico);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE - Deletar serviço
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await servicosManager.delete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Serviço não encontrado' });
        }
        res.json({ message: 'Serviço deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Buscar serviços por filtros
router.get('/search/filter', async (req, res) => {
    try {
        const servicos = await servicosManager.find(req.query);
        res.json(servicos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;










