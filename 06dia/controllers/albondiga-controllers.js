const Albondiga = require('../models/albondiga');

function createAlbondiga(req, res) {
    const { name, round } = req.body;
    const newAlbondiga = new Albondiga({ name, round });
    newAlbondiga.save()
        .then(albondiga => res.status(201).json(albondiga))
        .catch(err => res.status(400).json({ message: err.message }));
}

function getAlbondigas(req, res) {
    Albondiga.find()
        .then(albondigas => res.json(albondigas))
        .catch(err => res.status(500).json({ message: err.message }));
}

function getAlbondigaById(req, res) {
    const { id } = req.params;
    Albondiga.findById(id)
        .then(albondiga => {   
        if (!albondiga) {
            return res.status(404).json({ message: 'Albondiga not found' });
        }
        res.json(albondiga);
    })
    .catch(err => res.status(500).json({ message: err.message }));
}

function deleteAlbondiga(req, res) {
    const { id } = req.params;
    Albondiga.findByIdAndDelete(id)
        .then(albondiga => {
            if (!albondiga) {
                return res.status(404).json({ message: 'Albondiga not found' });
            }
            res.json({ message: 'Albondiga deleted' });
        })
        .catch(err => res.status(500).json({ message: err.message }));
}

module.exports = {
    createAlbondiga,
    getAlbondigas,
    getAlbondigaById,
    deleteAlbondiga
};