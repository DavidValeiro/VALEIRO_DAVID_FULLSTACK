const express = require('express');
const { createPersonInCsvFile, getAllPersons, getPersonById, updatePersonById, deletePersonById} = require('../controllers/person-controllers');
const router = express.Router();

router.post('/', createPersonInCsvFile);
router.get('/', getAllPersons);
router.get('/:id', getPersonById);
router.put('/:id', updatePersonById);
router.delete('/:id', deletePersonById);

module.exports = router;