const express = require('express');
const router = express.Router();
const {
  addSupplierService,
  getSuppliersService,
  findSuppliersByPrefixService
} = require('./Services/suppliers.service');

// Create supplier
router.post("/", async (req, res) => {
  try {
    const supplier = await addSupplierService(req.body);
    res.status(201).json({ message: "Supplier added", supplier });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all suppliers
router.get("/", async (req, res) => {
  try {
    const suppliers = await getSuppliersService();
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Find suppliers by prefix
router.post("/search", async (req, res) => {
  try {
    const { prefix } = req.body;
    const suppliers = await findSuppliersByPrefixService(prefix);
    res.json(suppliers);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
