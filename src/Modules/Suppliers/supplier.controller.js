const express = require('express');
const router = express.Router();
const {
    addSupplierService,
    getSuppliersService,
    findSuppliersByPrefixService
} = require('./Services/suppliers.service');

const addSupplier = async (req, res) => {
    try {
        const supplier = await addSupplierService(req.body);
        res.status(201).json({ message: "Supplier added", supplier });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getSuppliers = async (req, res) => {
    try {
        const suppliers = await getSuppliersService();
        res.json(suppliers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const findSuppliersByPrefix = async (req, res) => {
    try {
        const { prefix } = req.body;
        const suppliers = await findSuppliersByPrefixService(prefix);
        res.json(suppliers);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Define routes
router.post('/', addSupplier);
router.get('/', getSuppliers);
router.post('/search', findSuppliersByPrefix);

module.exports = router;
  