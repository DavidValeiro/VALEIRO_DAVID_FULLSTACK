import Slider from "../components/Slider/Slider"
import {useState, useEffect} from "react";
import Carrousel from "../components/Carrousel/Carrousel";
import Menu from "../components/Menu/Menu";
    
const images = [
    'https://placecats.com/1000/1000',
    'https://placecats.com/2000/1000',
    'https://placecats.com/850/1000',
];

const photos = [
    'https://placecats.com/1000/1000',
    'https://placecats.com/2000/1000',
    'https://placecats.com/850/1000',
    'https://placecats.com/1000/1000',
    'https://placecats.com/2000/1000',
    'https://placecats.com/850/1000',
];


const Ej1 = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 gap-3">
        <h1 className="text-4xl font-bold text-center">Ejercicio 1</h1>
        <p className="text-center">Este es el primer ejercicio de React</p>
        <Menu />
        <Slider images={images} />
        <Carrousel photos={photos} />

    </div>

  )
}

export default Ej1