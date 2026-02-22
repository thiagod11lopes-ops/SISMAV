const express = require('express');
const router = express.Router();
const DataManager = require('../models/DataManager');

const viaturasManager = new DataManager('viaturasCadastradas');

// GET - Listar todas as viaturas
router.get('/', async (req, res) => {
    try {
        const viaturas = await viaturasManager.getAll();
        res.json(viaturas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Obter viatura por ID
router.get('/:id', async (req, res) => {
    try {
        const viatura = await viaturasManager.getById(req.params.id);
        if (!viatura) {
            return res.status(404).json({ error: 'Viatura não encontrada' });
        }
        res.json(viatura);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST - Criar nova viatura
router.post('/', async (req, res) => {
    try {
        const viatura = await viaturasManager.create(req.body);
        res.status(201).json(viatura);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT - Atualizar viatura
router.put('/:id', async (req, res) => {
    try {
        const viatura = await viaturasManager.update(req.params.id, req.body);
        if (!viatura) {
            return res.status(404).json({ error: 'Viatura não encontrada' });
        }
        res.json(viatura);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE - Deletar viatura
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await viaturasManager.delete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Viatura não encontrada' });
        }
        res.json({ message: 'Viatura deletada com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;










