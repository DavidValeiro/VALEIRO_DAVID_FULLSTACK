// Nivel 2

let prompt = require('prompt-sync')();


function containsS(str){
    return str.toLowerCase().includes('s');
}
let inputStr = prompt('Ingrese una cadena de texto: ');
console.log(containsS(inputStr));



function evenOrOdd(num){
    if (num % 2 === 0) {
        return 'Par';
    } else {
        return 'Impar';
    }
}
let inputNum = parseInt(prompt('Ingrese un número: '));
console.log(evenOrOdd(inputNum));



function elevateToItself(num){
    return num ** num;
}  
let inputNum2 = parseInt(prompt('Ingrese un número: '));
console.log(elevateToItself(inputNum2));



function rectangleArea(base, height){
    return base * height;
}
let base = parseInt(prompt('Ingrese la base del rectángulo: '));
let height = parseInt(prompt('Ingrese la altura del rectángulo: '));
console.log(rectangleArea(base, height));



function triangleRectangleArea(base, height){
    return (base * height) / 2;
}
let base2 = parseInt(prompt('Ingrese la base del triángulo: '));
let height2 = parseInt(prompt('Ingrese la altura del triángulo: '));
console.log(triangleRectangleArea(base2, height2));



function circleArea(radius){
    return Math.PI * radius ** 2;
}
let radius = parseInt(prompt('Ingrese el radio del círculo: '));
console.log(circleArea(radius));
