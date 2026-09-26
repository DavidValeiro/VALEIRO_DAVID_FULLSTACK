const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    ip: { type: String },
    is_admin: { type: Boolean, default: false },
    pokemon: {
        id: { type: Number },
        name: { type: String },
        shiny: { type: Boolean, default: false }
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;