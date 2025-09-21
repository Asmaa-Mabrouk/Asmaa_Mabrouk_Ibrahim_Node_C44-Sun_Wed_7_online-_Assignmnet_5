const express = require("express");
const router = express.Router();
const {
  createUserService,
  grantPermissionService,
  revokePermissionService
} = require("./Services/users.services");

// Create user
router.post("/create", (req, res) => {
  try {
    const result = createUserService(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Grant permission
router.post("/grant", (req, res) => {
  try {
    const result = grantPermissionService(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Revoke permission
router.post("/revoke", (req, res) => {
  try {
    const result = revokePermissionService(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
