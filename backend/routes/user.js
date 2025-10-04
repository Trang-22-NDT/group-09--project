// routes/user.js
const express = require('express');
const { getUsers, createUser } = require('../controllers/userController');

const router = express.Router();

// GET /api/users
router.get('/', getUsers);

// POST /api/users
router.post('/', createUser);

module.exports = router;
