// Nivel 3

let prompt = require('prompt-sync')();



function elevateToPower(num, power){
    return num ** power;
}
let inputNum = parseInt(prompt('Ingrese un número: '));
let inputPower = parseInt(prompt('Ingrese la potencia: '));
console.log(elevateToPower(inputNum, inputPower));



function fibonacci(n){
    let fib = [1, 1];
    while (fib.length < n) {
        fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
    }
    return fib;
}
let inputFib = parseInt(prompt('Ingrese la cantidad de números de Fibonacci a generar: '));
console.log(fibonacci(inputFib));