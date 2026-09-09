import {useState} from 'react'

const Counter = () => {
    const [count, setCount] = useState(0)

    function handleClick() {
        setCount(count + 1)
    }

    return (
        <div>
            <button onClick={handleClick}>{count}</button>
        </div>
    )
}

export default Counter