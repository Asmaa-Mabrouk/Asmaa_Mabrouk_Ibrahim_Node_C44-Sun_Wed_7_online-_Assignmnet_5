const pool = require('../../../DB/connection');

// Handle table alterations dynamically
const alterTableService = async ({ table, action, column, type }) => {
    if (!table || !action) {
        throw new Error("Table and action are required");
    }

    // Validate table name (basic security check)
    const validTables = ['Products', 'Sales', 'Suppliers'];
    if (!validTables.includes(table)) {
        throw new Error(`Invalid table name. Allowed tables: ${validTables.join(', ')}`);
    }

    let sql;
    switch (action) {
        case "add-column":
            if (!column || !type) throw new Error("Column name and type are required for add-column action");
            sql = `ALTER TABLE ${table} ADD COLUMN ${column} ${type}`;
            break;
        case "remove-column":
            if (!column) throw new Error("Column name is required for remove-column action");
            sql = `ALTER TABLE ${table} DROP COLUMN ${column}`;
            break;
        case "change-column":
            if (!column || !type) throw new Error("Column name and type are required for change-column action");
            sql = `ALTER TABLE ${table} MODIFY COLUMN ${column} ${type}`;
            break;
        case "add-notnull":
            if (!column || !type) throw new Error("Column name and type are required for add-notnull action");
            sql = `ALTER TABLE ${table} MODIFY ${column} ${type} NOT NULL`;
            break;
        default:
            throw new Error("Invalid action. Allowed actions: add-column, remove-column, change-column, add-notnull");
    }

    try {
        await pool.query(sql);
        return { message: `Table ${table} altered successfully`, action, column, type };
    } catch (error) {
        console.error('Database alteration error:', error);
        throw new Error(`Failed to alter table: ${error.message}`);
    }
};

module.exports = {
    alterTableService
};
