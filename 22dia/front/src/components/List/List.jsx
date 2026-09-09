import {useState} from 'react'

const List = () => {
    const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3'])

    function addItem() {
        setItems([...items, `Item ${items.length + 1}`])
    }

    return (
        <div>
            <ul>
                {items.map((item, index) => (<li key={index}>{item}</li>))}
            </ul>
            <button onClick={addItem}>
                Agregar Item
            </button>
        </div>
    )
}

export default List
