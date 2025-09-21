const pool = require('../../../DB/connection');

const addProductsService = async (products) => {
  if (!Array.isArray(products) || products.length === 0) {
    throw new Error("Products must be a non-empty array");
  }

  const inserted = [];
  const updated = [];
  const skipped = [];

  for (const p of products) {
    if (!p.ProductName || !p.Price || !p.StockQuantity || !p.SupplierID) {
      skipped.push({ ...p, reason: "Missing required fields" });
      continue;
    }

    const [supplier] = await pool.query("SELECT * FROM Suppliers WHERE SupplierID = ?", [p.SupplierID]);
    if (supplier.length === 0) {
      skipped.push({ ...p, reason: `SupplierID ${p.SupplierID} does not exist` });
      continue;
    }

    const [existing] = await pool.query(
      "SELECT * FROM Products WHERE ProductName = ? AND SupplierID = ?",
      [p.ProductName, p.SupplierID]
    );

    if (existing.length > 0) {
      const existingProduct = existing[0];
      const newStock = existingProduct.StockQuantity + p.StockQuantity;
      const newPrice = p.Price; // overwrite or keep old? Here we overwrite

      await pool.query(
        "UPDATE Products SET StockQuantity = ?, Price = ? WHERE ProductID = ?",
        [newStock, newPrice, existingProduct.ProductID]
      );

      updated.push({ ...existingProduct, NewStockQuantity: newStock, NewPrice: newPrice });
    } else {
      const sql = "INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) VALUES (?, ?, ?, ?)";
      const [result] = await pool.query(sql, [p.ProductName, p.Price, p.StockQuantity, p.SupplierID]);

      inserted.push({ ProductID: result.insertId, ...p });
    }
  }

  return {
    message: "Batch process completed",
    insertedCount: inserted.length,
    updatedCount: updated.length,
    skippedCount: skipped.length,
    inserted,
    updated,
    skipped
  };
};

const updateProductService = async (id, updates) => {
  if (!id) throw new Error("ProductID is required");

  const fields = [];
  const values = [];

  if (updates.ProductName) {
    fields.push("ProductName = ?");
    values.push(updates.ProductName);
  }
  if (updates.Price) {
    if (updates.Price <= 0) throw new Error("Price must be greater than 0");
    fields.push("Price = ?");
    values.push(updates.Price);
  }
  if (updates.StockQuantity !== undefined) {
    if (updates.StockQuantity < 0) throw new Error("Stock cannot be negative");
    fields.push("StockQuantity = ?");
    values.push(updates.StockQuantity);
  }

  if (fields.length === 0) throw new Error("No valid fields provided");
  values.push(id);

  const sql = `UPDATE Products SET ${fields.join(", ")} WHERE ProductID = ?`;
  const [result] = await pool.query(sql, values);
  if (result.affectedRows === 0) throw new Error("Product not found");

  return { message: "Product updated successfully" };
};

const deleteProductService = async (id) => {
  const [result] = await pool.query("DELETE FROM Products WHERE ProductID = ?", [id]);
  if (result.affectedRows === 0) throw new Error("Product not found");
  return { message: "🗑️ Product deleted successfully" };
};

const getTopStockProductService = async () => {
  const [rows] = await pool.query("SELECT * FROM Products ORDER BY StockQuantity DESC LIMIT 1");
  return rows[0] || {};
};

const getUnsoldProductsService = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM Products WHERE ProductID NOT IN (SELECT DISTINCT ProductID FROM Sales)"
  );
  return rows;
};

const getAllProductsService = async () => {
  const [rows] = await pool.query("SELECT * FROM Products");
  return rows;
};

module.exports = {
  addProductsService,
  updateProductService,
  deleteProductService,
  getTopStockProductService,
  getUnsoldProductsService,
  getAllProductsService
};

