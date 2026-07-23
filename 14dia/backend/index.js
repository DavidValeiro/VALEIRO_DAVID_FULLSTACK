const db = require('./config/db');
const express = require('express');
const userRouter = require('./routes/user-router');
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const authorize = require('./middlewares/authorization');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/users', userRouter);
app.use(authorize);

db();


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});