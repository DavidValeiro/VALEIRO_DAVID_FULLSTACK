require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const authRoutes = require('./routes/auth');
const cors = require('cors');
const helmet = require('helmet');

connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '5mb' }));
app.use(helmet());

app.use(cors('*'));

app.get('/', (req, res) => {
    res.send('Welcome to the 38dia API');
});

app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
