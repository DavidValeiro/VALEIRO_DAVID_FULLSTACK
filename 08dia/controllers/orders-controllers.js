const Order = require('../models/order');
const Product = require('../models/product');

async function calculateTotalPrice(products) {
    let total = 0;
    for (const item of products) {
        const product = await Product.findById(item.product);
        if (!product) {
            throw new Error(`Product with ID ${item.product} not found`);
        }
        total += product.price * item.quantity;
    }
    return total;
}

async function createOrder(req, res) {
    const { user, products, orderStatus } = req.body;
    const totalPrice = await calculateTotalPrice(products);

    const newOrder = new Order({ user, products, totalPrice, orderStatus });
    newOrder.save()
        .then(() => {
            newOrder.products.map(item => Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } }, { returnDocument: 'after' }));
            return newOrder;
        })
        .then(order => res.status(201).json(order))
        .catch(err => res.status(400).json({ message: err.message }));
}

async function getOrders(req, res) {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function getOrderById(req, res) {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function updateOrder(req, res) {
    const { user, products, orderStatus } = req.body;
    const totalPrice = await calculateTotalPrice(products);
    const oldOrder = await Order.findById(req.params.id);
    const oldProductQuantityMap = {};
    oldOrder.products.forEach(item => {
        oldProductQuantityMap[item.product.toString()] = item.quantity;
    });

    if (!oldOrder) {
        return res.status(404).json({ message: 'Order not found' });
    }
    oldOrder.products.map(item => Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } }, { returnDocument: 'after' }));
    
    Order.findByIdAndUpdate(req.params.id, { user, products, totalPrice, orderStatus }, { returnDocument: 'after' })
        .then(updatedOrder => {
            if (!updatedOrder) {
                return res.status(404).json({ message: 'Order not found' });
            }
            updatedOrder.products.map(item => {
                const oldQuantity = oldProductQuantityMap[item.product.toString()] || 0;
                const quantityDiff = item.quantity - oldQuantity;
                return Product.findByIdAndUpdate(item.product, { $inc: { stock: -quantityDiff } }, { returnDocument: 'after' });
            });
            return updatedOrder;
        })
        .then(order => res.status(201).json(order))
        .catch(err => res.status(500).json({ message: err.message }));
}

function deleteOrder(req, res) {
    Order.findByIdAndDelete(req.params.id)
        .then(deletedOrder => {
            if (!deletedOrder) {
                return res.status(404).json({ message: 'Order not found' });
            }
            res.json({ message: 'Order deleted' });
        })
        .catch(err => res.status(500).json({ message: err.message }));
}

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder
};