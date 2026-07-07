const mongoose = require('mongoose');

const pricePattern = /^\d+(\.\d{1,2})?$/;

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true},
    description: String,
    inStock: { type: Boolean, default: true }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;