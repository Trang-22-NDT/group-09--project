// routes/user.js
const express = require('express');
const { getUsers, createUser } = require('../controllers/userController');

const router = express.Router();

// GET /users
router.get('/', getUsers);

// POST /users
router.post('/', createUser);

module.exports = router;
