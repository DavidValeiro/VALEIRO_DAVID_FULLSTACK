const mongoose = require('mongoose');

const emailPattern = /^[^\s@]{3,}@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema({
    name: String,
    email: {type: String, required: true, unique: true, match: emailPattern},
    age: Number
});

const User = mongoose.model('User', userSchema);
module.exports = User;