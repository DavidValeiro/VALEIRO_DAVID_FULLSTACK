import {useEffect, useState} from 'react'
import './DivChange.css'

const DivChange = () => {

    const [color, setColor] = useState(() => localStorage.getItem('color') || 'color1');
    const [border, setBorder] = useState(() => localStorage.getItem('border') || 'border1');

    useEffect(() => {
        localStorage.setItem('color', color);
        localStorage.setItem('border', border);
    }, [color, border]);


    const handleClick = () => {
        setBorder(prevBorder => prevBorder === 'border1' ? 'border2' : 'border1');
    }

    const handlehover = () => {
        setColor(prevColor => prevColor === 'color1' ? 'color2' : 'color1');
    }

    return (
        <div className={`div ${color} ${border}`} onClick={handleClick} onMouseEnter={handlehover}>
            Cambiar color y borde
        </div>
    )
}

export default DivChange