let prompt = require('prompt-sync')();

let arrayColor = ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Brown', 'Black', 'White'];

function showIndexedElements(lista){
    lista.forEach((element, index) => {
        console.log(`Elemento: ${element} - Índice: ${index}`);
    });
}

// showIndexedElements(arrayColor);

let newArrayColor = [...arrayColor];
function addThingToArray(lista, thing){
    console.log(lista.map((element, index) => element + ' Índice ' + index + thing));
}

// addThingToArray(newArrayColor, ' - color');

function searchInArray(lista){
    let search = prompt('Busca el elemento: ');
    console.log(lista.find(element => element.includes(search)) + ' está en la lista');
}

// searchInArray(arrayColor);

function filterArray(lista){
    let search = prompt('Introduce la letra que quieras buscar: ');
    let filtered = lista.filter(element => element.includes(search));
    console.log(`Los siguientes elementos incluyen la letra "${search}": ` + filtered.join(', '));
}

// filterArray(arrayColor);

