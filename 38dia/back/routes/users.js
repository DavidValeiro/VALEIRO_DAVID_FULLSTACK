const express = require('express');
const router = express.Router();
const { createUser, getUsers, getUserById, updateUser, deleteUser } = require('../controllers/users-controllers');
const { requireAuth } = require('../middlewares/auth');
const { requireSelfOrAdmin } = require('../middlewares/ownership');

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', requireAuth, requireSelfOrAdmin, updateUser);
router.delete('/:id', requireAuth, requireSelfOrAdmin, deleteUser);

module.exports = router;
