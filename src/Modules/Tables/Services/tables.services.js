const pool = require('../../../DB/connection');

const alterTableService = async ({ table, action, column, type }) => {
  if (!table || !action || !column) {
    throw new Error("Table, action, and column are required");
  }

  // Security: Whitelist allowed tables
  const allowedTables = ['Products', 'Sales', 'Suppliers'];
  if (!allowedTables.includes(table)) {
    throw new Error(`Table operations only allowed on: ${allowedTables.join(', ')}`);
  }

  const allowedActions = ["ADD", "DROP", "MODIFY"];
  if (!allowedActions.includes(action.toUpperCase())) {
    throw new Error("Invalid action. Use ADD, DROP, or MODIFY");
  }

  let sql;
  switch (action.toUpperCase()) {
    case "ADD":
      if (!type) throw new Error("Column type required for ADD");
      sql = `ALTER TABLE ${table} ADD COLUMN ${column} ${type}`;
      break;
    case "DROP":
      sql = `ALTER TABLE ${table} DROP COLUMN ${column}`;
      break;
    case "MODIFY":
      if (!type) throw new Error("Column type required for MODIFY");
      sql = `ALTER TABLE ${table} MODIFY COLUMN ${column} ${type}`;
      break;
  }

  try {
    await pool.query(sql);
    return { 
      message: `Table ${table} altered successfully`,
      operation: { table, action: action.toUpperCase(), column, type }
    };
  } catch (error) {
    console.error('Table alteration error:', error);
    throw new Error(`Failed to alter table: ${error.message}`);
  }
};

module.exports = {
  alterTableService
};
