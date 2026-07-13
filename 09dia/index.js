require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const texts = require('./routes/texts');

connectDB();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/texts', texts);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// const http = require('http');

// const server = http.createServer((req, res) => {
//     res.writeHead(200, { 'Content-Type': 'text/plain' });
//     res.end('Hello, World!\n');
// });
// server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });


