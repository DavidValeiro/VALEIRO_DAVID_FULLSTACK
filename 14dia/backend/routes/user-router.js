const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorization');
const { register, login, getUser } = require('../controllers/user-controller');

router.post('/register', register);
router.post('/login', login);
router.get('/user', authorize, getUser);