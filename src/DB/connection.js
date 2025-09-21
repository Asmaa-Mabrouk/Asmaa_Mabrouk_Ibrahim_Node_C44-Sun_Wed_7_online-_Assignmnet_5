const mysql = require('mysql2/promise');
require('dotenv').config();

const createDatabaseConnection = async () => {
  const tempConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  };

  try {
    const tempPool = mysql.createPool(tempConfig);
    const connection = await tempPool.getConnection();
    await connection.query(`CREATE DATABASE IF NOT EXISTS retail_store`);
    console.log("Database 'retail_store' created or already exists");
    connection.release();
    await tempPool.end();
  } catch (error) {
    console.log("Database creation error:", error.message);
  }
};

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'retail_store',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);

const initializeDB = async () => {
  await createDatabaseConnection();
  const connection = await pool.getConnection();
  console.log("Database connected successfully!");

  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Suppliers (
        SupplierID INT AUTO_INCREMENT PRIMARY KEY,
        SupplierName VARCHAR(100) NOT NULL,
        ContactNumber VARCHAR(15) UNIQUE
      )`);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS Products (
        ProductID INT AUTO_INCREMENT PRIMARY KEY,
        ProductName VARCHAR(100) NOT NULL,
        Price DECIMAL(10,2) CHECK (Price > 0),
        StockQuantity INT CHECK (StockQuantity >= 0),
        SupplierID INT,
        FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID)
      )`);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS Sales (
        SaleID INT AUTO_INCREMENT PRIMARY KEY,
        ProductID INT,
        QuantitySold INT CHECK (QuantitySold > 0),
        SaleDate DATE,
        FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
      )`);
  } catch (e) {
    console.error("DB initialization error:", e.message);
  }
};

initializeDB();
module.exports = pool;
