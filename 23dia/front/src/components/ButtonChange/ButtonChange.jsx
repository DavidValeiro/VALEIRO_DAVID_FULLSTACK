import { useState } from 'react' 
import './ButtonChange.css'

const ButtonChange = () => {
    const [color, setColor] = useState('color1')

    const handleClick = () => {
        setColor(prevColor => prevColor === 'color1' ? 'color2' : 'color1')
    }

    return (
        <button className={color} onClick={handleClick}>
            Cambiar color
        </button>
    )
}

export default ButtonChange