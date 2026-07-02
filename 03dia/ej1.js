let prompt = require('prompt-sync')();

let arrayColor = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black', 'white'];
console.log(arrayColor);

function showArrayPos(lista){
    let arrayLength = lista.length;
    console.log(`La lista tiene ${arrayLength} elementos`);
    let position = parseInt(prompt(`Introduce una posición entre 0 y ${arrayLength - 1}: `));
    console.log(lista[position]);
}

// showArrayPos(arrayColor);

let newArrayColor = [...arrayColor];
newArrayColor.unshift('magenta');
console.log(newArrayColor);


let newArrayColor2 = [...arrayColor];
newArrayColor2.push('cyan');
console.log(newArrayColor2);

let newArraySpliced = [...arrayColor];
newArraySpliced.splice(4,2);
console.log(newArraySpliced);

function showElementPosition(lista){
    console.log(lista);
    let element = prompt('Introduce el color que quieras para saber su posición: ');
    console.log((lista.indexOf(element)) + 1);
}

// showElementPosition(arrayColor);

let reversedArray = [...arrayColor];
reversedArray.reverse();
console.log(reversedArray);

let strArray = arrayColor.join(' , ');
console.log(strArray);

let reArrayed = strArray.split(' , ');
console.log(reArrayed);