import './Fruitlist.css';

function FruitList() {
    let fruits = ["Apple", "Banana", "Cherry", "Date", "Elderberry"];
    let count = fruits.length;
    return (
        <div className="fruit-list">
            <h2>Fruit List</h2>
            <ul>
                {fruits.map((fruit, index) => (
                    <li key={index} className="fruit-item">
                        <h3>{fruit}</h3>
                    </li>
                ))}
            </ul>
            <p className="fruit-count">Total fruits: {count}</p>
        </div>
    );
}

export default FruitList;