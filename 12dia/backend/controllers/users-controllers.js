const User = require('../models/user');

function createUser(req, res) {
    const { name, email, password} = req.body;
    const newUser = new User({ name, email, password });
    newUser.save()
        .then(user => res.status(201).json(user))
        .catch(err => res.status(400).json({ message: err.message }));
}

function getUsers(req, res) {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(500).json({ message: err.message }));
}

function getUserById(req, res) {
    User.findById(req.params.id)
        .then(user => {   
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    })
    .catch(err => res.status(500).json({ message: err.message }));
}

function updateUser(req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' })
        .then(updatedUser => {
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(updatedUser);
        })
        .catch(err => res.status(500).json({ message: err.message }));
}

function deleteUser(req, res) {
    User.findByIdAndDelete(req.params.id)
        .then(deletedUser => {
            if (!deletedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ message: 'User deleted' });
        })
        .catch(err => res.status(500).json({ message: err.message }));
}

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};