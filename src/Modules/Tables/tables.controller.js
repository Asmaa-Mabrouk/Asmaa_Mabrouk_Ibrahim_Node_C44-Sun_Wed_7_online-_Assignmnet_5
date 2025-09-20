const express = require('express');
const router = express.Router();
const { alterTableService } = require('./Services/tables.services');

// POST /tables/alter
const alterTable = async (req, res) => {
    try {
        const { table, action, column, type } = req.body;
        const result = await alterTableService({ table, action, column, type });
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Define routes
router.post('/alter', alterTable);

module.exports = router;
