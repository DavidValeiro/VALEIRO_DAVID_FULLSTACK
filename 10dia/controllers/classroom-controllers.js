const Classroom = require('../model/classroom');
const manageFile = require('fs');
const express = require('express');
const Person = require('../model/person');

function readAndCleanCsvFile() {
    const csvData = manageFile.readFileSync('./localDB/classroom-archive.csv', 'utf-8');
    const lines = csvData.trim().split('\n');
    lines.shift();
    return lines;
}

function getPersons() {
    const csvData = manageFile.readFileSync('./localDB/person-archive.csv', 'utf-8');
    const Personlines = csvData.trim().split('\n');
    Personlines.shift();
    const persons = Personlines.map(line => {
        const [id, name, surname, isTeacher, birthDate] = line.split(',');
        return new Person(id, name, surname, isTeacher, birthDate);
    });
    return persons;
}

function verifyTeacher(teacherId) {
    const persons = getPersons();
    const teacher = persons.find(person => { 
        return person.id === teacherId;
    });
    return teacher ? true : false;
}

function verifyStudents(studentIds) {
    const persons = getPersons();
    const studentIdsArray = Array.isArray(studentIds) ? studentIds : [studentIds];
    console.log('Student IDs:', studentIdsArray);
    const validStudents = studentIdsArray.filter(studentId => {
        const student = persons.find(person => person.id === studentId);
        console.log(`Verifying student ID: ${studentId}, Found: ${student ? 'Yes' : 'No'}`);
        return student ? true : false;
    });
    return validStudents;
}


function createClassroomInCsvFile(req, res) {
    const { name, teacher_Id, students } = req.body;
    const validStudents = verifyStudents(students);
    const validTeacher = verifyTeacher(teacher_Id);
    if (!validTeacher) {
        return res.status(400).json({ message: 'Invalid teacher ID' });
    }else if (validStudents.length !== students.length) {
        return res.status(400).json({ message: 'One or more student IDs are invalid' });
    }
    if (validTeacher && validStudents.length === students.length) {
        const id = Date.now().toString();
        const classroom = new Classroom(id, name, teacher_Id, validStudents);
        const csvData = `${classroom.id},${classroom.name},${classroom.teacher_Id},${classroom.students.join(';')}\n`;
        manageFile.appendFileSync('./localDB/classroom-archive.csv', csvData);
        res.status(201).json({ message: 'Classroom created successfully' });
    }
}

function getAllClassrooms(req, res) {
    const lines = readAndCleanCsvFile();
    const classrooms = lines.map(line => {
        const [id, name, teacher_Id, students] = line.split(',');
        const studentIds = students.split(';');
        return new Classroom(id, name, teacher_Id, studentIds);
    });
    res.status(200).json(classrooms);
}

function getClassroomById(req, res) {
    const classroomId = req.params.id;
    const lines = readAndCleanCsvFile();
    const classroomLine = lines.find(line => line.startsWith(classroomId));
    if (!classroomLine) {
        return res.status(404).json({ message: 'Classroom not found' });
    }
    const [id, name, teacher_Id, students] = classroomLine.split(',');
    const studentIds = students.split(';');
    const classroom = new Classroom(id, name, teacher_Id, studentIds);
    res.status(200).json(classroom);
}

function updateClassroom(req, res) {
    const lines = readAndCleanCsvFile();
    const classroomIndex = lines.findIndex(line => line.startsWith(req.params.id));
    if (classroomIndex === -1) {
        return res.status(404).json({ message: 'Classroom not found' });
    }
    const { id, name, teacher_Id, students } = req.body;
    const validStudents = verifyStudents(students);
    const validTeacher = verifyTeacher(teacher_Id);
    if (!validTeacher) {
        return res.status(400).json({ message: 'Invalid teacher ID' });
    } else if (validStudents.length !== students.length) {
        return res.status(400).json({ message: 'One or more student IDs are invalid' });
    }
    lines[classroomIndex] = `${id},${name},${teacher_Id},${validStudents.join(';')}`;
    manageFile.writeFileSync('./localDB/classroom-archive.csv', lines.join('\n'));
    res.status(200).json({ message: 'Classroom updated successfully' });
}

function deleteClassroom(req, res) {
    const classroomId = req.params.id;
    const lines = readAndCleanCsvFile();
    const updatedLines = lines.filter(line => !line.startsWith(classroomId));
    if (updatedLines.length === lines.length) {
        return res.status(404).json({ message: 'Classroom not found' });
    }
    const updatedCsvData = 'id,name,teacher_Id,students\n' + updatedLines.join('\n');
    manageFile.writeFileSync('./localDB/classroom-archive.csv', updatedCsvData);
    res.status(200).json({ message: 'Classroom deleted successfully' });
}

module.exports = {
    createClassroomInCsvFile,
    getAllClassrooms,
    getClassroomById,
    updateClassroom,
    deleteClassroom
}

