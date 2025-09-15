const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'retail_store',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Initialize database
const initializeDB = async () => {
  const connection = await pool.getConnection();
  console.log("✅ Database connected successfully!");
 
  try {
    // Task 1: Create tables 
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Suppliers (
        SupplierID INT AUTO_INCREMENT PRIMARY KEY,
        SupplierName TEXT,
        ContactNumber VARCHAR(15)
      )`);  

    await connection.query(`
      CREATE TABLE IF NOT EXISTS Products (
        ProductID INT AUTO_INCREMENT PRIMARY KEY,
        ProductName TEXT NOT NULL,
        Price DECIMAL(10,2),
        StockQuantity INT,
        SupplierID INT,
        FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID)
      )`); 

    await connection.query(`
      CREATE TABLE IF NOT EXISTS Sales (
        SaleID INT AUTO_INCREMENT PRIMARY KEY,
        ProductID INT,
        QuantitySold INT,
        SaleDate DATE,
        FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
      )`);  
        
    // Task 2: Add Category column
    try {
      await connection.query(`ALTER TABLE Products ADD COLUMN Category VARCHAR(50)`);
    } catch (e) {
      console.error("❌ Database connection failed:", e.message);    }
    
    // Task 3: Remove Category column
    try {
      await connection.query(`ALTER TABLE Products DROP COLUMN Category`);
    } catch (e) {
      console.error("❌ Database connection failed:", e.message);
    }
    
    // Task 6: Insert sample data
    // 6a: Add supplier
    const [supplier] = await connection.query(
      `INSERT INTO Suppliers (SupplierName, ContactNumber) 
       VALUES ('FreshFoods', '01001234567')`
    );
    
    // 6b: Insert products
    await connection.query(
      `INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) VALUES 
       ('Milk', 15.00, 50, ?),
       ('Bread', 10.00, 30, ?),
       ('Eggs', 20.00, 40, ?)`,
      [supplier.insertId, supplier.insertId, supplier.insertId]
    );
    
    // 6c: Add sale record
    const [products] = await connection.query(
      "SELECT ProductID FROM Products WHERE ProductName = 'Milk'"
    );
    await connection.query(
      `INSERT INTO Sales (ProductID, QuantitySold, SaleDate) 
       VALUES (?, 2, '2025-05-20')`,
      [products[0].ProductID]
    );    
    // Task 7: Update bread price
    await connection.query(`UPDATE Products SET Price = 25.00 WHERE ProductName = 'Bread'`);
    
    // Task 8: Delete eggs
    await connection.query(`DELETE FROM Products WHERE ProductName = 'Eggs'`);
    
    try {
      // Task 14: Create user and grant permissions
      await connection.query(`
        CREATE USER IF NOT EXISTS 'store_manager'@'localhost' 
        IDENTIFIED BY 'secure_password'
      `);
      await connection.query(`
        GRANT SELECT, INSERT, UPDATE ON retail_store.* 
        TO 'store_manager'@'localhost'
      `);
      
      // Task 15: Revoke UPDATE permission
      await connection.query(`
        REVOKE UPDATE ON retail_store.* 
        FROM 'store_manager'@'localhost'
      `);
      
      // Task 16: Grant DELETE on Sales
      await connection.query(`
        GRANT DELETE ON retail_store.Sales 
        TO 'store_manager'@'localhost'
      `);
    } catch (permErr) {
      console.log(permErr.message);
    }
  } catch (err) {
    console.log(err.message);
  } finally {
    connection.release();
  }
};

initializeDB();
module.exports = pool;