const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { createUser, getUsers, getUserById, updateUser, deleteUser } = require('../controllers/users-controllers');

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
