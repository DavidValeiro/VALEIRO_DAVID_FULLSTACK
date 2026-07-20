const express = require('express');
const cors = require('cors');
const dns = require('node:dns/promises');

dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']); 

const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');

const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
const connectDB = require('./config/db');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/orders', orderRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;