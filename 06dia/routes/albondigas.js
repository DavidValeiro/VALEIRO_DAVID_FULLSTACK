const express = require('express');
const router = express.Router();
const Albondiga = require('../models/albondiga');
const { createAlbondiga, getAlbondigas, getAlbondigaById, deleteAlbondiga } = require('../controllers/albondiga-controllers');

// Crear una nueva albóndiga 
router.post('/', createAlbondiga);

// Obtener todas las albóndigas
router.get('/', getAlbondigas);

// Obtener una albóndiga por ID
router.get('/:id', getAlbondigaById);

// Eliminar una albóndiga
router.delete('/:id', deleteAlbondiga);

module.exports = router;
