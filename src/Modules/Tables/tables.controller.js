const express = require("express");
const router = express.Router();
const { alterTableService } = require("./Services/tables.services");

router.post("/alter", async (req, res) => {
  try {
    const result = await alterTableService(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
