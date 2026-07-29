import React from 'react';
import './Products.css';

function Product({ product }) {
    return (
        <div className="product-card" >
            <h2>{product.name}</h2>
            <p className="product-price">Price: ${product.price.toFixed(2)}</p>
            <p className="product-description">{product.description}</p>
        </div>
    );
}

export default Product;
