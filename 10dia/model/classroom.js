const Person = require('../model/person');
const manageFile = require('fs');
const { readAndCleanCsvFile } = require('../controllers/person-controllers');

class Classroom {
    constructor(id, name, teacher_Id, students) {
        this.id = id;
        this.name = name;
        this.teacher_Id = teacher_Id;
        this.students = students;
    }
}

module.exports = Classroom;
