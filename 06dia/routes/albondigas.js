const express = require('express');
const router = express.Router();
const Albondiga = require('../models/albondiga');
const { createAlbondiga, getAlbondigas } = require('../controllers/albondiga-controllers');

// Crear una nueva albóndiga 
router.post('/', createAlbondiga);

// Obtener todas las albóndigas
router.get('/', getAlbondigas);

module.exports = router;
