require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { getConnectionInfo } = require('./config/db');
const userRoutes = require('./routes/users');
const notFound = require('./middlewares/not-found');
const errorHandler = require('./middlewares/errorHandler');

connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: '*',
}));
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({
        status: getConnectionInfo().readyState === 1 ? 'ok' : 'error',
        ...getConnectionInfo(),
        jwtSecretSet: !!process.env.JWT_SECRET,
    });
});

app.get('/', (req, res) => {
    res.send('Welcome to the Users API');
});

async function ensureDb(req, res, next) {
    try {
        await connectDB();
        next();
    } catch (err) {
        res.status(500).json({
            message: 'Database connection failed',
            detail: err.message,
        });
    }
}

app.use(ensureDb);

app.use('/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;