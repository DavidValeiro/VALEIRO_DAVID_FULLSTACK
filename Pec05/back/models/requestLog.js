const mongoose = require('mongoose');

const requestLogSchema = new mongoose.Schema({
    ip: { type: String, required: true }
}, {
    timestamps: true
});

requestLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

const RequestLog = mongoose.model('RequestLog', requestLogSchema);
module.exports = RequestLog;