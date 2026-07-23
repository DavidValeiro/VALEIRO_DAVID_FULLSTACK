const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');


const app = express();
app.use(helmet()); // Use Helmet to secure Express apps by setting various HTTP headers
app.use(morgan('dev')); //Manda logs que se pueden guargar y configurar en un archivo de log, es mas completo que el dev.


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});