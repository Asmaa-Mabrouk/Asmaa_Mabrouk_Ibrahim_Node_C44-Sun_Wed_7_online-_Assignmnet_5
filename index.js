const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;

// DB connection initialized
require("./src/DB/connection");

app.use(express.json());

// Routes
app.use("/api/products", require("./src/Modules/Products/products.controller"));
app.use("/api/sales", require("./src/Modules/Sales/sales.controller"));
app.use("/api/suppliers", require("./src/Modules/Suppliers/supplier.controller"));
app.use("/api/users", require("./src/Modules/Users/users.controller"));
app.use("/api/tables", require("./src/Modules/Tables/tables.controller"));

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
