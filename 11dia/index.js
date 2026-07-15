const express = require('express');
const app = express();
const notFound = require('./middlewares/not-found');
const verification = require('./middlewares/verification');
const cors = require('cors');
const morgan = require('morgan');
const serverError = require('./middlewares/server-error');
const countRequest = require('./middlewares/count');
const fs = require('fs');
const path = require('path');
const morganLogStream = fs.createWriteStream(path.join(__dirname, './logs/morgan.log'), { flags: 'a' });
const ping = require('./middlewares/ping');
const ip = require('./middlewares/ip');

app.use(ip.blockIp);
app.use(ip.saveIpToFile);
app.use(ping);
app.use(countRequest);

app.use(morgan('dev', { stream: morganLogStream }));

app.use(cors());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(verification);

app.get('/protected', (req, res) => {
    res.send('This is a protected route!');
});

app.use(serverError);

app.use(notFound);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

