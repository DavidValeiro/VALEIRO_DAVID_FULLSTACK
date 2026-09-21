const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registrationAttempts = new Map();
const REGISTRATION_WINDOW_MS = 60 * 1000;
const MAX_REGISTRATIONS_PER_IP = 5;
const REGISTRATION_TIMEOUT_MS = 60 * 1000;

function createUser(req, res) {
    const { name, email, password, is_admin, pokemon } = req.body;
    bcrypt.hash(password, 10)
        .then(hashedPassword => {
            const newUser = new User({ name, email, password: hashedPassword, is_admin, pokemon });
            return newUser.save();
        })
        .then(user => {
            user.password = undefined;
            res.status(201).json(user);
        })
        .catch(err => res.status(400).json({ message: err.message }));
}

function registerUser(req, res) {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const attempts = registrationAttempts.get(ip) || {
        count: 0,
        windowStart: now,
        blockedUntil: 0
    };

    if (attempts.blockedUntil > now) {
        const retryAfter = Math.ceil((attempts.blockedUntil - now) / 1000);
        res.set('Retry-After', retryAfter);
        return res.status(429).json({ message: 'Demasiados registros. Inténtalo más tarde.' });
    }

    if (now - attempts.windowStart >= REGISTRATION_WINDOW_MS) {
        attempts.count = 0;
        attempts.windowStart = now;
    }

    attempts.count += 1;
    if (attempts.count > MAX_REGISTRATIONS_PER_IP) {
        attempts.blockedUntil = now + REGISTRATION_TIMEOUT_MS;
        registrationAttempts.set(ip, attempts);
        res.set('Retry-After', REGISTRATION_TIMEOUT_MS / 1000);
        return res.status(429).json({ message: 'Demasiados registros. Inténtalo más tarde.' });
    }
    registrationAttempts.set(ip, attempts);

    const { name, email, password, pokemon } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Nombre, email y contraseña son obligatorios' });
    }
    bcrypt.hash(password, 10)
        .then(hashedPassword => {
            const newUser = new User({
                name,
                email,
                password: hashedPassword,
                is_admin: false,
                pokemon: pokemon || { id: 132, name: 'ditto', shiny: false }
            });
            return newUser.save();
        })
        .then(user => {
            user.password = undefined;
            res.status(201).json(user);
        })
        .catch(err => res.status(400).json({ message: err.message }));
}

function loginUser(req, res) {
    const { email, password } = req.body;
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (!isMatch) {
                        return res.status(401).json({ message: 'Invalid credentials' });
                    }
                    const token = jwt.sign(
                        { id: user._id, email: user.email, is_admin: user.is_admin },
                        process.env.JWT_SECRET,
                        { expiresIn: '1h' }
                    );
                    res.json({ token });
                });
        })
        .catch(err => res.status(500).json({ message: err.message }));
}

function getUsers(req, res) {
    User.find().select('-password')
        .then(users => res.json(users))
        .catch(err => res.status(500).json({ message: err.message }));
}

function getUserById(req, res) {
    User.findById(req.params.id).select('-password')
        .then(user => {   
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    })
    .catch(err => res.status(500).json({ message: err.message }));
}

function updateUser(req, res) {
    const updateData = { ...req.body };
    delete updateData._id;

    const applyUpdate = (data) => User.findByIdAndUpdate(req.params.id, data, { returnDocument: 'after' })
        .select('-password')
        .then(updatedUser => {
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(updatedUser);
        })
        .catch(err => res.status(500).json({ message: err.message }));

    if (updateData.password) {
        bcrypt.hash(updateData.password, 10)
            .then(hashedPassword => {
                updateData.password = hashedPassword;
                applyUpdate(updateData);
            })
            .catch(err => res.status(500).json({ message: err.message }));
    } else {
        delete updateData.password;
        applyUpdate(updateData);
    }
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
    registerUser,
    loginUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};