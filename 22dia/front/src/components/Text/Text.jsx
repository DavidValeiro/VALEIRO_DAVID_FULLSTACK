import {useState} from 'react'

const TextUpdater = () => {
    const [text, setText] = useState('Escriba debajo su texto')
    return (
        <div>
            <p>{text}</p>
            <input type="text" onChange={(e) => setText(e.target.value)} />
        </div>
    )
}

export default TextUpdater