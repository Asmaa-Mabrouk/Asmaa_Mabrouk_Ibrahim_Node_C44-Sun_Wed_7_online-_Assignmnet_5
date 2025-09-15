const pool = require('../../../DB/connection');

const insertSale = (sale) => {
  const sql = 'INSERT INTO Sales (ProductID, QuantitySold, SaleDate) VALUES (?, ?, ?)';
  
  pool.query(sql, [sale.ProductID, sale.QuantitySold, sale.SaleDate])
    .then(result => console.log('Sale inserted:', result[0].insertId))
    .catch(err => console.error('Sale insert error:', err));
};

const getTotalSold = () => {
  const sql = `
    SELECT P.ProductName, SUM(S.QuantitySold) AS TotalSold
    FROM Sales S
    JOIN Products P ON S.ProductID = P.ProductID
    GROUP BY S.ProductID
  `;
  
  pool.query(sql)
    .then(([rows]) => console.table(rows))
    .catch(err => console.error('Total sold error:', err));
};

const getHighestStock = () => {
  const sql = 'SELECT * FROM Products ORDER BY StockQuantity DESC LIMIT 1';
  
  pool.query(sql)
    .then(([rows]) => console.log('Highest stock product:', rows[0]))
    .catch(err => console.error('Highest stock error:', err));
};

// Get all sales with product details
const getAllSales = (callback) => {
  const sql = `
    SELECT S.SaleID, P.ProductName, S.SaleDate, S.QuantitySold
    FROM Sales S
    JOIN Products P ON S.ProductID = P.ProductID
  `;
  
  pool.query(sql)
    .then(([rows]) => callback(null, rows))
    .catch(err => callback(err));
};

module.exports = { 
  insertSale, 
  getTotalSold, 
  getHighestStock,
  getAllSales
};