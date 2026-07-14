const express = require('express');
const { createClassroomInCsvFile, getAllClassrooms, getClassroomById, updateClassroom, deleteClassroom} = require('../controllers/classroom-controllers');
const router = express.Router();

router.post('/', createClassroomInCsvFile);
router.get('/', getAllClassrooms);
router.get('/:id', getClassroomById);
router.put('/:id', updateClassroom);
router.delete('/:id', deleteClassroom);

module.exports = router;