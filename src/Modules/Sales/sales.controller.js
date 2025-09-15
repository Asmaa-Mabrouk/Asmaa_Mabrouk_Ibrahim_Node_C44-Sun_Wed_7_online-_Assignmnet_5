const express = require('express');
const router = express.Router();
const pool = require('../../DB/connection');
const { getAllSales } = require('./Services/sales.service');

// Record new sale
router.post('/', (req, res) => {
  const { ProductID, QuantitySold, SaleDate } = req.body;
  
  pool.query(`INSERT INTO Sales (ProductID, QuantitySold, SaleDate) VALUES (?, ?, ?)`,
    [ProductID, QuantitySold, SaleDate])
    .then(([result]) => {
      res.send({ message: 'Sale added', SaleID: result.insertId });
    })
    .catch(err => {
      console.error('Sale insert error:', err);
      res.status(500).send(err);
    });
});

// Get total sold per product
router.get('/total-sold', (req, res) => {
  const sql = `
    SELECT P.ProductName, SUM(S.QuantitySold) AS TotalSold
    FROM Sales S
    JOIN Products P ON S.ProductID = P.ProductID
    GROUP BY S.ProductID
  `;
  
  pool.query(sql)
    .then(([rows]) => {
      res.send(rows);
    })
    .catch(err => {
      console.error('Total sold error:', err);
      res.status(500).send(err);
    });
});

// Get all sales with product details
router.get('/all', (req, res) => {
  getAllSales((err, sales) => {
    if (err) {
      console.error('Get sales error:', err);
      return res.status(500).send(err);
    }
    res.send(sales);
  });
});

// Delete sale
router.delete('/:id', (req, res) => {
  pool.query('DELETE FROM Sales WHERE SaleID = ?', [req.params.id])
    .then(() => {
      res.send({ message: 'Sale deleted' });
    })
    .catch(err => {
      console.error('Sale delete error:', err);
      res.status(500).send(err);
    });
});

module.exports = router; 