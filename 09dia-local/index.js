const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

function createFileIfNotExists() {
    if (!fs.existsSync('text.txt')) {
        fs.writeFileSync('text.txt', '', 'utf8');
        console.log('text.txt file created.');
    }
}

app.get('/', (req, res) => {
    fs.readFile('text.txt', 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                createFileIfNotExists();
                return res.send('File did not exist, but it has been created. Please try again.');
            }
            return res.status(500).send('Error reading file.');
        }
        if (!data) {
            return res.send('File is empty. Please add some text.');
        }
        return res.send(data);
    });
});

app.post('/', (req, res) => {
    const { data } = req.body;
    const oldData = fs.readFileSync('text.txt', 'utf8');
    const newData = oldData + '\n' + data;
    fs.writeFile('text.txt', newData, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('Data written to file successfully.');
        }
    });
    res.send('Data written to file successfully.');
});

app.delete('/', (req, res) => {
    fs.unlink('text.txt', (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            res.status(500).send('Error deleting file');
            return;
        }
        res.send('File deleted successfully.');
    });
});


// const http = require('http');

// const server = http.createServer((req, res) => {
//     res.writeHead(200, { 'Content-Type': 'text/plain' });
//     res.end('Hello, World!\n');
// });
// server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });


