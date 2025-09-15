const pool = require('../../../DB/connection');

const insertProducts = (products) => {
  const sql = 'INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) VALUES ?';
  const values = products.map(p => [p.ProductName, p.Price, p.StockQuantity, p.SupplierID]);
  
  pool.query(sql, [values])
    .then(result => console.log('Products inserted:', result[0].affectedRows))
    .catch(err => console.error('Product insert error:', err));
};

const updateBreadPrice = () => {
  pool.query(`UPDATE Products SET Price = 25.00 WHERE ProductName = 'Bread'`)
    .then(() => console.log('Bread price updated'))
    .catch(err => console.error('Bread update error:', err));
};

const deleteEggs = () => {
  pool.query(`DELETE FROM Products WHERE ProductName = 'Eggs'`)
    .then(() => console.log('Eggs deleted'))
    .catch(err => console.error('Eggs delete error:', err));
};

// Get all products
const getAllProducts = (callback) => {
  pool.query(`
    SELECT p.*, s.SupplierName 
    FROM Products p
    LEFT JOIN Suppliers s ON p.SupplierID = s.SupplierID
  `)
    .then(([rows]) => callback(null, rows))
    .catch(err => callback(err));
};

module.exports = { 
  insertProducts, 
  updateBreadPrice, 
  deleteEggs,
  getAllProducts } ; 
