// Nivel 2

let n = 6;

function printSquare(n) {
    var message = ""
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            message += " *"
        }
        message += "\n"
    }
    console.log(message)
}      

function emptysquare(n){
    var message = ""
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i === 0 || i === n - 1 || j === 0 || j === n - 1) {
                message += " *"
            } else {
                message += "  "
            }
        }   
        message += "\n"   
}
    console.log(message)
}

function printTriangleLeft(n) {
    var message = ""
    for (let i = 0; i < n; i++) {
        for (let j = 0; j <= i; j++) {
            message += " *"
        }
        message += "\n"
    }
    console.log(message)
}

function printTriangleRight(n) {
    var message = ""
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (j < n - i - 1) {
                message += "  "
            } else {
                message += " *"
            }
        }  
        message += "\n"
    }
    console.log(message)
} 

printSquare(n);
emptysquare(n);
printTriangleLeft(n);
printTriangleRight(n);

