const Product = require('../models/productModel');

async function createProduct(req, res) {
    try {
        const { name, description } = req.body;
        const imagePath = req.file.path;
        const newProduct = await Product.create({ name, description, imagePath });
        res.status(201).json({ status: 'success', data: newProduct });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
}

module.exports = { createProduct };
