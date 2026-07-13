require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the Users API');
});

app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});