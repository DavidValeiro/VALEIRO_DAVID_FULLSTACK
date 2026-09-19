const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/pec05";

let connectionPromise = null;
let connectionError = null;

const connectDB = () => {
    if (!connectionPromise) {
        connectionPromise = mongoose
            .connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 })
            .then(() => {
                connectionError = null;
                console.log('Connected to MongoDB');
                return mongoose.connection;
            })
            .catch((err) => {
                connectionError = err;
                connectionPromise = null;
                console.error('Error connecting to MongoDB:', err.message);
                if (!process.env.VERCEL) {
                    process.exit(1);
                }
                throw err;
            });
    }
    return connectionPromise;
};

function sanitizeUri(uri) {
    try {
        return uri.replace(/\/\/([^@]+)@/, '//****:****@').split('?')[0];
    } catch {
        return uri;
    }
}

const getConnectionInfo = () => ({
    uriSet: !!process.env.MONGODB_URI,
    uri: sanitizeUri(MONGODB_URI),
    readyState: mongoose.connection.readyState,
    error: connectionError ? connectionError.message : null,
});

module.exports = connectDB;
module.exports.getConnectionInfo = getConnectionInfo;