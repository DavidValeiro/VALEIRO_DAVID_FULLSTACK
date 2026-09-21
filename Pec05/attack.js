const { exec } = require('child_process');

let letras = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

letras.forEach((letra) => {
    let r = exec(`curl --url 'https://valeiro-david-fullstack.vercel.app/users/register' \
  -H 'accept: */*' \
  -H 'accept-language: es-ES,es;q=0.9' \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -H 'origin: https://valeiro-david-fullstack-wthe.vercel.app' \
  -H 'pragma: no-cache' \
  -H 'priority: u=1, i' \
  -H 'referer: https://valeiro-david-fullstack-wthe.vercel.app/' \
  -H 'sec-ch-ua: "Chromium";v="152", "Not?A_Brand";v="24", "Google Chrome";v="152"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: cross-site' \
  -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36' \
  --data-raw '{"name":"qwrerqwer","email":"${letra}@${letra}.${letra}","password":"1234","pokemon":{"id":25,"name":"pikachu","shiny":false}}'`,
        (error, stdout, stderr) => {
            if (error) {
                console.error(`Error al ejecutar el comando: ${error.message}`);
                return;
            }

            if (stderr) {
                console.error(`Error en el comando: ${stderr}`);
                return;
            }

           

        })

         console.log(`Usuario creado con el email: ${letra}@${letra}.${letra}`)
})