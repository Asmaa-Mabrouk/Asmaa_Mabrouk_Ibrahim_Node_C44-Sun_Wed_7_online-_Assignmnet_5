const express = require('express');
const router = express.Router();
const pool = require('../../DB/connection');
const { getAllProducts } = require('./Services/products.service');

// Create multiple products
router.post('/', (req, res) => {
  const products = req.body.products;
  const sql = 'INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) VALUES ?';
  const values = products.map(p => [p.ProductName, p.Price, p.StockQuantity, p.SupplierID]);
  
  pool.query(sql, [values])
    .then(([result]) => {
      res.send({ message: 'Products added', rows: result.affectedRows });
    })
    .catch(err => {
      console.error('Product insert error:', err);
      res.status(500).send(err);
    });
});

// Update bread price
router.put('/bread', (req, res) => {
  pool.query(`UPDATE Products SET Price = 25.00 WHERE ProductName = 'Bread'`)
    .then(() => {
      res.send({ message: 'Bread price updated' });
    })
    .catch(err => {
      console.error('Bread update error:', err);
      res.status(500).send(err);
    });
});

// Delete eggs
router.delete('/eggs', (req, res) => {
  pool.query(`DELETE FROM Products WHERE ProductName = 'Eggs'`)
    .then(() => {
      res.send({ message: 'Eggs product deleted' });
    })
    .catch(err => {
      console.error('Eggs delete error:', err);
      res.status(500).send(err);
    });
});

// Get highest stock product
router.get('/top-stock', (req, res) => {
  pool.query(`SELECT * FROM Products ORDER BY StockQuantity DESC LIMIT 1`)
    .then(([rows]) => {
      res.send(rows[0] || {});
    })
    .catch(err => {
      console.error('Top stock error:', err);
      res.status(500).send(err);
    });
});

// Get unsold products
router.get('/unsold', (req, res) => {
  pool.query(`SELECT * FROM Products WHERE ProductID NOT IN (SELECT DISTINCT ProductID FROM Sales)`)
    .then(([rows]) => {
      res.send(rows);
    })
    .catch(err => {
      console.error('Unsold products error:', err);
      res.status(500).send(err);
    });
});

// Get all products
router.get('/', (req, res) => {
  getAllProducts((err, products) => {
    if (err) {
      console.error('Get products error:', err);
      return res.status(500).send(err);
    }
    res.send(products);
  });
});

module.exports = router;