const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const pool = require('./src/DB/connection'); 
app.use(express.json());

// Routes
const productRoutes = require('./src/Modules/Products/products.controller');
const salesRoutes = require('./src/Modules/Sales/sales.controller');

app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);

// Supplier APIs 
app.post('/api/suppliers', (req, res) => {
  const { SupplierName, ContactNumber } = req.body;
  const sql = `INSERT INTO Suppliers (SupplierName, ContactNumber) VALUES (?, ?)`;
  pool.query(sql, [SupplierName, ContactNumber])
    .then(([result]) => {
      res.send({ message: 'Supplier added', SupplierID: result.insertId });
    })
    .catch(err => {
      console.error('Supplier creation error:', err);
      res.status(500).send(err);
    });
});

// Get suppliers starting with 'F'
app.get('/api/suppliers/F', (req, res) => {
  pool.query(`SELECT * FROM Suppliers WHERE SupplierName LIKE 'F%'`)
    .then(([rows]) => {
      res.send(rows);
    })
    .catch(err => {
      console.error('Suppliers Starting with F error:', err);
      res.status(500).send(err);
    });
});

// Get all suppliers
app.get('/api/suppliers', (req, res) => {
  pool.query('SELECT * FROM Suppliers')
    .then(([rows]) => {
      res.send(rows);
    })
    .catch(err => {
      console.error('Get suppliers error:', err);
      res.status(500).send(err);
    });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});