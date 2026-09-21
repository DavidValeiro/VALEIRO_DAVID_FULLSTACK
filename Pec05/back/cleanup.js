require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/user');

async function cleanup() {
    try {
        await connectDB();
        const pattern = /^[A-Za-z]@[A-Za-z]\.[A-Za-z]$/;
        const result = await User.deleteMany({ email: pattern });
        console.log(`Eliminados ${result.deletedCount} usuarios creados por attack.js`);
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

cleanup();