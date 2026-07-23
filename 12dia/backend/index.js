const express = require('express');
const connectDB = require('./config/db');
const userRouter = require('./routes/users');
const taskRouter = require('./routes/tasks');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
connectDB();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/users', userRouter);
app.use('/tasks', taskRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});