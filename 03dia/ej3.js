import  im2  from  "image-and-video-to-ascii";

let arrayColor = ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Brown', 'Black', 'White'];

const [primero, segundo, tercero, cuarto, quinto, sexto, septimo, octavo, noveno, decimo] = arrayColor;

console.log(primero);
console.log(segundo);
console.log(tercero);
console.log(cuarto);
console.log(quinto);
console.log(sexto);
console.log(septimo);
console.log(octavo);
console.log(noveno);
console.log(decimo);

let arrayColor2 = [...arrayColor];

arrayColor2.push('Ultraviolet');
console.log(arrayColor2);

im2.showImage("canva-MAGzG5kx6jY.jpg", {height : 50 , width : 50});
