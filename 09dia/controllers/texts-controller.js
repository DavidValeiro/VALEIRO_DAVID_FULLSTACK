const manageFile = require('fs')
const Text = require('../model/text.js');

function createText(req, res){
    const { content } = req.body;
    const newText = new Text({ content });
    try {
        newText.save();
        res.status(201).json(newText);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

function readTexts(req, res) {
    Text.find()
        .then((texts) => {
            res.json(texts);
        })
        .catch((error) => {
            res.status(400).json({ message: error.message });
        });
}

function deleteText(req, res) {
    const { id } = req.params;
    Text.findByIdAndDelete(id)
        .then((deletedText) => {
            if (!deletedText) {
                return res.status(404).json({ message: 'Text not found' });
            }
            res.json({ message: 'Text deleted successfully' });
        })
        .catch((error) => {
            res.status(400).json({ message: error.message });
        });
}

module.exports = {
    createText,
    readTexts,
    deleteText,
};