const mongoose = require('mongoose');

const albondigaSchema = new mongoose.Schema({
    name: { type: String, required: true },
    round: { type: Boolean, default: true }
}, {
    timestamps: true
});

const Albondiga = mongoose.model('Albondiga', albondigaSchema);
module.exports = Albondiga;