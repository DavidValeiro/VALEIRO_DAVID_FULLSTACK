const https = require('https');

const letras = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

function register(letra) {
    return new Promise((resolve) => {
        const body = JSON.stringify({
            name: "qwrerqwer",
            email: `${letra}@${letra}.${letra}`,
            password: "1234",
            pokemon: { id: 25, name: "pikachu", shiny: false }
        });

        const req = https.request({
            hostname: 'valeiro-david-fullstack.vercel.app',
            path: '/users/register',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body)
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log(`${letra} -> ${res.statusCode} ${data.slice(0, 120)}`);
                resolve();
            });
        });

        req.on('error', (err) => {
            console.log(`${letra} -> ERROR ${err.message}`);
            resolve();
        });

        req.end();
    });
}

Promise.all(letras.map(register)).then(() => {
    console.log('Ataque completado');
});