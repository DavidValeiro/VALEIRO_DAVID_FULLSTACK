const Person = require('../model/person');
const manageFile = require('fs');
const express = require('express');

function readAndCleanCsvFile() {
    const csvData = manageFile.readFileSync('localDB/person-archive.csv', 'utf-8');
    const lines = csvData.trim().split('\n');
    lines.shift(); //Está línea elimina la primera línea del archivo CSV, que contiene los encabezados de las columnas. Esto es útil si solo queremos trabajar con los datos reales y no con los nombres de las columnas.
    return lines;
}

function createPersonInCsvFile(req, res) {
    const person = new Person(req.body.name, req.body.surname, req.body.isTeacher, req.body.birthDate);
    const csvData = `${person.id},${person.name},${person.surname},${person.isTeacher},${person.birthDate}\n`;
    manageFile.appendFileSync('localDB/person-archive.csv', csvData);
    res.status(201).json({ message: 'Person created successfully' });
}

function getAllPersons(req, res) {
    const lines = readAndCleanCsvFile();
    const persons = lines.map(line => {
        const [id, name, surname, isTeacher, birthDate] = line.split(',');
        return new Person(name, surname, isTeacher, birthDate);
    });
    res.status(200).json(persons);
}

function getPersonById(req, res) {
    const lines = readAndCleanCsvFile();
    const person = lines.map(line => {
        const [id, name, surname, isTeacher, birthDate] = line.split(',');
        return new Person(name, surname, isTeacher, birthDate);
    }).find(person => person.id === req.params.id);
    if (person) {
        res.status(200).json(person);
    } else {
        res.status(404).json({ message: 'Person not found' });
    }
}

function updatePersonById(req, res) {
    const lines = readAndCleanCsvFile();
    const personIndex = lines.findIndex(line => {
        const [id] = line.split(',');
        return id === req.params.id;
    });
    if (personIndex !== -1) {
        const [id, name, surname, isTeacher, birthDate] = lines[personIndex].split(',');
        const updatedPerson = new Person(req.body.name || name, req.body.surname || surname, req.body.isTeacher || isTeacher, req.body.birthDate || birthDate);
        lines[personIndex] = `${updatedPerson.id},${updatedPerson.name},${updatedPerson.surname},${updatedPerson.isTeacher},${updatedPerson.birthDate}`;
        manageFile.writeFileSync('localDB/person-archive.csv', lines.join('\n'));
        res.status(200).json({ message: 'Person updated successfully' });
    } else {
        res.status(404).json({ message: 'Person not found' });
    }
}

function deletePersonById(req, res) {
    const lines = readAndCleanCsvFile();
    const personIndex = lines.findIndex(line => {
        const [id] = line.split(',');
        return id === req.params.id;
    });
    if (personIndex !== -1) {
        lines.splice(personIndex, 1);
        manageFile.writeFileSync('localDB/person-archive.csv', lines.join('\n'));
        res.status(200).json({ message: 'Person deleted successfully' });
    } else {
        res.status(404).json({ message: 'Person not found' });
    }
}

module.exports = {
    createPersonInCsvFile,
    getAllPersons,
    getPersonById,
    updatePersonById,
    deletePersonById
};
