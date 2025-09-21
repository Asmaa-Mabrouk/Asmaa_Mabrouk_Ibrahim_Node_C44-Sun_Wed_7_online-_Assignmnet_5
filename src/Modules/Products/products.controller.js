const express = require("express");
const router = express.Router();
const {
  addProductsService,
  updateProductService,
  deleteProductService,
  getTopStockProductService,
  getUnsoldProductsService,
  getAllProductsService
} = require("./Services/products.service");

// Create multiple products
router.post("/", async (req, res) => {
  try {
    const result = await addProductsService(req.body.products);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update product
router.put("/:id", async (req, res) => {
  try {
    const result = await updateProductService(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete product
router.delete("/:id", async (req, res) => {
  try {
    const result = await deleteProductService(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get top stock product
router.get("/top-stock", async (req, res) => {
  try {
    const result = await getTopStockProductService();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get unsold products
router.get("/unsold", async (req, res) => {
  try {
    const result = await getUnsoldProductsService();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await getAllProductsService();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
