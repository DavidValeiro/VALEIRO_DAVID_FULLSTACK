require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const userRoutes = require('./routes/users');

connectDB();   

const app = express();
const PORT = process.env.PORT || 3000; 

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

