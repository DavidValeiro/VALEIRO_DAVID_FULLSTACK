import {useState, useEffect} from 'react'

const RandomBackground = () => {

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    const [color, setColor] = useState('#ffffff')
    useEffect(() => {
    const interval = setInterval(() => {
        setColor(getRandomColor())
    }, 1000)
    return () => clearInterval(interval)
    }, [])

    return (
        <div style={{ backgroundColor: color }}>    
            <p>{color}</p>
        </div>
    )
}

export default RandomBackground