import Product from '../products/Products';
import './Productlist.css';
import { useState } from 'react';

function Productlist() {
    const [products] = useState([
        { name: "Laptop", price: 999, description: "A high-performance laptop for all your computing needs.", featured: true },
        { name: "Smartphone", price: 699, description: "A sleek and powerful smartphone for your daily needs.", featured: false},
        { name: "Headphones", price: 199, description: "Noise-cancelling headphones for immersive sound experience.", featured: true },
        { name: "Smartwatch", price: 299, description: "A stylish smartwatch to keep you connected on the go.", featured: false },
        { name: "Tablet", price: 499, description: "A versatile tablet for work and play.", featured: true },
        { name: "Camera", price: 799, description: "Capture stunning photos and videos with this high-quality camera.", featured: false },
    ]);

    const featuredProductsCount = products.filter((p) => p.featured).length;

    return (
        <div className="products-container">
            <h1>Products</h1>
            <div className="product-list">
                {products.map((product, index) => (
                    <Product key={index} product={product} />
                ))}
            </div>
            <h3>Featured Products Count: {featuredProductsCount}</h3>
        </div>
    );
}

export default Productlist;