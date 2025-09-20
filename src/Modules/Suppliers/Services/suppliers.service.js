const pool = require('../../../DB/connection');

const addSupplierService = async (data) => {
    if (!data.SupplierName || !data.ContactNumber) {
        throw new Error("SupplierName and ContactNumber are required");
    }
    
    // Validate contact number format (basic validation)
    const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
    if (!phoneRegex.test(data.ContactNumber)) {
        throw new Error("ContactNumber must be a valid phone number (10-15 digits)");
    }
    
    // Validate supplier name length
    if (data.SupplierName.trim().length < 2) {
        throw new Error("SupplierName must be at least 2 characters long");
    }
    
    try {
        const sql = 'INSERT INTO Suppliers (SupplierName, ContactNumber) VALUES (?, ?)';
        const [result] = await pool.query(sql, [data.SupplierName.trim(), data.ContactNumber.trim()]);
        
        return {
            SupplierID: result.insertId,
            SupplierName: data.SupplierName.trim(),
            ContactNumber: data.ContactNumber.trim()
        };
    } catch (error) {
        console.error('Supplier creation error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error('Supplier with this contact number already exists');
        }
        throw new Error(`Failed to create supplier: ${error.message}`);
    }
};

const getSuppliersService = async () => {
    const sql = 'SELECT * FROM Suppliers';
    const [rows] = await pool.query(sql);
    return rows;
};

const findSuppliersByPrefixService = async (prefix) => {
    if (!prefix) throw new Error("Prefix required");
    
    const sql = 'SELECT * FROM Suppliers WHERE SupplierName LIKE ?';
    const [rows] = await pool.query(sql, [`${prefix}%`]);
    return rows;
};

module.exports = {
    addSupplierService,
    getSuppliersService,
    findSuppliersByPrefixService
};
