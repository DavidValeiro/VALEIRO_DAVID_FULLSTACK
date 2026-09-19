const express = require('express');
const router = express.Router();
const { createUser, loginUser, getUsers, getUserById, updateUser, deleteUser } = require('../controllers/users-controllers');
const authorization = require('../middlewares/authorization');
const adminOnly = require('../middlewares/adminOnly');

router.post('/login', loginUser);
router.post('/', authorization, adminOnly, createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', authorization, adminOnly, updateUser);
router.delete('/:id', authorization, adminOnly, deleteUser);

module.exports = router;