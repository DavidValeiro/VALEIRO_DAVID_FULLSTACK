// Nivel 1
let prompt = require('prompt-sync')();

function printNumPar(num){
    let numbers = [];
    for (let i = 1; i <= num; i++) {
        if (i % 2 === 0) {
            numbers.push(i);
        }
    }
    return numbers.join(', ');
}

function saludar(nombre = 'Invitado'){
   console.log(`Bienvenido ${nombre}`)
}

function procesarEntradaUsuario(saludar){
    let nombre = prompt('Introduce tu nombre: ')
    if (nombre == ''){
        saludar()
    }else{
        saludar(nombre)
    }
}

function multiplicationTable(){
    let number = parseInt(prompt('Ingrese un número para la tabla de multiplicar: '));
    let table = '';
    for (let i = 1; i <= 10; i++) {
        table += `${number} x ${i} = ${number * i}\n`;
    }
    return table;
}

console.log(printNumPar(100));
procesarEntradaUsuario(saludar);
console.log(multiplicationTable());