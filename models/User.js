const express = require("express");
const { getUsers, createUser, updateUser, deleteUser } = require("../controllers/userController");

const router = express.Router();
router.get("/", getUsers);        // GET /users
router.post("/", createUser);     // POST /users
router.put("/:id", updateUser);   // PUT /users/:id
router.delete("/:id", deleteUser);// DELETE /users/:id

module.exports = router;
