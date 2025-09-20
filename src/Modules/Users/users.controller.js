const express = require('express');
const router = express.Router();
const {
    createUserService,
    grantPermissionService,
    revokePermissionService
} = require('./Services/users.services');

// POST /users/create
const createUser = async (req, res) => {
    try {
        const { username, password, permissions } = req.body;
        const newUser = createUserService({ username, password, permissions });
        res.json({ message: "User created successfully", user: newUser });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// POST /users/grant
const grantPermission = async (req, res) => {
    try {
        const { username, permission } = req.body;
        const updatedUser = grantPermissionService({ username, permission });
        res.json({ message: "Permission granted", user: updatedUser });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// POST /users/revoke
const revokePermission = async (req, res) => {
    try {
        const { username, permission } = req.body;
        const updatedUser = revokePermissionService({ username, permission });
        res.json({ message: "Permission revoked", user: updatedUser });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Define routes
router.post('/create', createUser);
router.post('/grant', grantPermission);
router.post('/revoke', revokePermission);

module.exports = router;
