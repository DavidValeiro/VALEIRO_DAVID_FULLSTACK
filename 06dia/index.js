require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const albondigasRoutes = require('./routes/albondigas');

connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the Albondigas API');
});

app.use('/albondigas', albondigasRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});