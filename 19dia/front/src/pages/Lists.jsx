import FruitList from "../components/fruits/Fruitlist";
import TaskList from "../components/tasks/Tasklist";
import ProductList from "../components/product/productlist/Productlist";
import './Lists.css';

function Lists() {
    return (
        <div className="lists-container">
            <h1>Lists</h1>
            <FruitList/>
            <TaskList/>
            <ProductList/>
        </div>
    );
}

export default Lists;