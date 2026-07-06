const csv = require('csv-parser');
const fs = require('fs');
const User = require('./models/User');
const connectDB = require('./db');
const results = [];

connectDB();

fs.createReadStream('users.csv')
    .pipe(csv({ separator: ';' }))
    .on('data', (data) => results.push(data))
    .on('end', () => {
        console.log(results);
        results.forEach(async (userData) => {
            const { name, email, age } = userData;
            const newUser = new User({ name, email, age });
            await newUser.save();
        });
    });
