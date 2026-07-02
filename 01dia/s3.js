// Nivel 3
// const readline = require('readline');

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

// rl.question("Introduce un número: ", (answer1) => {
//     let num1 = parseFloat(answer1);
//     rl.question("Introduce otro número: ", (answer2) => {
//         let num2 = parseFloat(answer2);
//         console.log("El resultado de la suma de " + num1 + " y " + num2 + " es: " + addnumbers(num1, num2));
//         rl.close();
//     });
// });

function addnumbers(n1, n2) {
    return parseFloat (n1 + n2);
}  

let prompt = require('prompt-sync')();
let n1 = parseFloat(prompt('Introduce un número: ')); 
let n2 = parseFloat(prompt('Ingrese otro numero: '));
console.log("El resultado de la suma de " + n1 + " y " + n2 + " es: " + addnumbers(n1, n2));
