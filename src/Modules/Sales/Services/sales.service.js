const pool = require('../../../DB/connection');

// Add new sale with stock check
const addSaleService = async (sale) => {
  if (!sale.ProductID || !sale.QuantitySold || !sale.SaleDate) {
    throw new Error("ProductID, QuantitySold, and SaleDate are required");
  }

  const [product] = await pool.query("SELECT StockQuantity FROM Products WHERE ProductID = ?", [sale.ProductID]);
  if (product.length === 0) throw new Error("Product not found");

  if (product[0].StockQuantity < sale.QuantitySold) {
    throw new Error("Not enough stock available for this sale");
  }

  const sql = 'INSERT INTO Sales (ProductID, QuantitySold, SaleDate) VALUES (?, ?, ?)';
  const [result] = await pool.query(sql, [sale.ProductID, sale.QuantitySold, sale.SaleDate]);

  await pool.query("UPDATE Products SET StockQuantity = StockQuantity - ? WHERE ProductID = ?", [sale.QuantitySold, sale.ProductID]);

  return { SaleID: result.insertId, ...sale };
};

const getSalesService = async () => {
  const sql = `
    SELECT S.SaleID, P.ProductName, S.SaleDate, S.QuantitySold
    FROM Sales S
    JOIN Products P ON S.ProductID = P.ProductID
  `;
  const [rows] = await pool.query(sql);
  return rows;
};

const getTotalSoldService = async () => {
  const sql = `
    SELECT P.ProductName, SUM(S.QuantitySold) AS TotalSold
    FROM Sales S
    JOIN Products P ON S.ProductID = P.ProductID
    GROUP BY S.ProductID
  `;
  const [rows] = await pool.query(sql);
  return rows;
};

const deleteSaleService = async (id) => {
  const [result] = await pool.query("DELETE FROM Sales WHERE SaleID = ?", [id]);
  if (result.affectedRows === 0) throw new Error("Sale not found");
  return { message: "Sale deleted successfully" };
};

module.exports = {
  addSaleService,
  getSalesService,
  getTotalSoldService,
  deleteSaleService
};

