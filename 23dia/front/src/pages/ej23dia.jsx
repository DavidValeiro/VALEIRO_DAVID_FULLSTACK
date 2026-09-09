import '../App.css'
import ButtonChange from '../components/ButtonChange/ButtonChange'
import DivChange from '../components/DivChange/DivChange'
const Ej23dia = () => { 

  return (
    <div className='flex flex-col items-center justify-center h-screen p-2 m-5 bg-black rounded-2xl' >
        <h2 className='text-xl font-bold underline pt-2'>Ejercicio 23</h2>
        <p className='text-red-500 '>Este es el ejercicio 23</p>
        <ButtonChange />
        <DivChange />
    </div>

  )
}

export default Ej23dia