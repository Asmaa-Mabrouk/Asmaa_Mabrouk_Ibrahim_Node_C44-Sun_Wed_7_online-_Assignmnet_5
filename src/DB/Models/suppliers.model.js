const connection = require('../connection');

const createSuppliersTable = `
CREATE TABLE IF NOT EXISTS Suppliers (
  SupplierID INT AUTO_INCREMENT PRIMARY KEY,
  SupplierName TEXT,
  ContactNumber VARCHAR(15)
);`;

connection.query(createSuppliersTable, (err) => {
  if (err) throw err;
  console.log('Suppliers table ready');
});
