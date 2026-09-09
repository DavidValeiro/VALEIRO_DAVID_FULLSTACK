import {useState} from 'react'

const Switch = () => {
    const [isOn, setIsOn] = useState(false)

    function handleClick() {
        setIsOn(!isOn)
    }
    
    return (
        <div>
            <button onClick={handleClick}>{isOn ? 'ON' : 'OFF'}</button>
        </div>
    )
}

export default Switch