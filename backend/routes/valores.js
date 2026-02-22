const express = require('express');
const router = express.Router();
const DataManager = require('../models/DataManager');

const valoresManager = new DataManager('valores');

// GET - Obter todos os valores
router.get('/', async (req, res) => {
    try {
        const valores = await valoresManager.getAll();
        res.json(valores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST - Salvar/Atualizar valores
router.post('/', async (req, res) => {
    try {
        const valores = await valoresManager.getAll();
        const existing = valores.find(v => v.id === req.body.id);
        
        if (existing) {
            const updated = await valoresManager.update(req.body.id, req.body);
            res.json(updated);
        } else {
            const created = await valoresManager.create(req.body);
            res.status(201).json(created);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT - Atualizar valores
router.put('/:id', async (req, res) => {
    try {
        const valores = await valoresManager.update(req.params.id, req.body);
        if (!valores) {
            return res.status(404).json({ error: 'Valores não encontrados' });
        }
        res.json(valores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;










