<<<<<<< HEAD
// routes/user.js
const express = require("express");
const { getUsers, createUser, updateUser, deleteUser } = require("../controllers/userController");

=======
const express = require('express');
>>>>>>> backend
const router = express.Router();
const userController = require('../controllers/userController');

<<<<<<< HEAD
router.get("/", getUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
=======
router.get('/users', userController.getUsers);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);
>>>>>>> backend

module.exports = router;
