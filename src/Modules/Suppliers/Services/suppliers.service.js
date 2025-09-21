const pool = require('../../../DB/connection');

const addSupplierService = async (data) => {
  if (!data.SupplierName || !data.ContactNumber) {
    throw new Error("SupplierName and ContactNumber are required");
  }

  if (data.SupplierName.trim().length < 2) {
    throw new Error("SupplierName must be at least 2 characters long");
  }

  const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
  if (!phoneRegex.test(data.ContactNumber)) {
    throw new Error("ContactNumber must be valid (10–15 digits)");
  }

  // Check duplicate name
  const [existing] = await pool.query("SELECT * FROM Suppliers WHERE SupplierName = ?", [data.SupplierName.trim()]);
  if (existing.length > 0) {
    throw new Error("Supplier with this name already exists");
  }

  const sql = 'INSERT INTO Suppliers (SupplierName, ContactNumber) VALUES (?, ?)';
  const [result] = await pool.query(sql, [data.SupplierName.trim(), data.ContactNumber.trim()]);

  return {
    SupplierID: result.insertId,
    SupplierName: data.SupplierName.trim(),
    ContactNumber: data.ContactNumber.trim()
  };
};

const getSuppliersService = async () => {
  const [rows] = await pool.query("SELECT * FROM Suppliers");
  return rows;
};

const findSuppliersByPrefixService = async (prefix) => {
  if (!prefix) throw new Error("Prefix required");
  const [rows] = await pool.query("SELECT * FROM Suppliers WHERE SupplierName LIKE ?", [`${prefix}%`]);
  return rows;
};

module.exports = {
  addSupplierService,
  getSuppliersService,
  findSuppliersByPrefixService
};
