const express = require('express');
const pool = require('../../DB/connection'); 
const router = express.Router();
const {
  addSaleService,
  getSalesService,
  getTotalSoldService,
  deleteSaleService
} = require('./Services/sales.service');

// Record new sale
router.post("/", async (req, res) => {
  try {
    const result = await addSaleService(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get total sold per product
router.get("/total-sold", async (req, res) => {
  try {
    const rows = await getTotalSoldService();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all sales with product details
router.get("/", async (req, res) => {
  try {
    const rows = await getSalesService();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete sale by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [saleRows] = await pool.query(
      'SELECT ProductID, QuantitySold FROM Sales WHERE SaleID = ?',
      [id]
    );
    if (saleRows.length === 0) {
      return res.status(404).json({ error: "Sale not found" });
    }
    const { ProductID, QuantitySold } = saleRows[0];
    await pool.query('DELETE FROM Sales WHERE SaleID = ?', [id]);
    await pool.query(
      'UPDATE Products SET StockQuantity = StockQuantity + ? WHERE ProductID = ?',
      [QuantitySold, ProductID]
    );

    res.json({ message: "Sale deleted and stock restored" });
  } catch (err) {
    console.error("Sale delete error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
