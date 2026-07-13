const express = require('express');
const router = express.Router();
const User = require('../model/text.js');
const { createText, readTexts, deleteText} = require('../controllers/texts-controller.js');

router.post('/', createText);
router.get('/', readTexts);
router.delete('/:id', deleteText);



module.exports = router;