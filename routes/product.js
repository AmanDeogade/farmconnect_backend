const express = require('express');
const Product = require('../models/product');
const productRoute = express.Router();
const Farmer = require('../models/farmer');

productRoute.post('/api/add-product', async (req, res) => {
    try {
        const { productName, productPrice, quantity, description, category, farmerId, fullName, subCategory, images, quantityUnit } = req.body; //extract image from the request the client will make
        const product = new Product({
            productName,
            productPrice,
            quantity,
            description,
            category,
            farmerId,
            fullName,
            subCategory,
            images,
            quantityUnit
        });
        await product.save();
        return res.status(201).send(product);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

productRoute.get('/api/popular-products', async (req, res) => {
    try {
        const product = await Product.find({ popular: true });  //get all the banner present in the database
        if (!product || product.length === 0) {
            return res.status(404).json({ msg: "No product found" });
        }
        else {
            return res.status(200).json({ product });
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

productRoute.get('/api/reccomended-products', async (req, res) => {
    try {
        const product = await Product.find({ reccomended: true });  //get all the banner present in the database
        if (!product || product.length === 0) {
            return res.status(404).json({ msg: "No product found" });
        }
        else {
            return res.status(200).json(product);
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

//new route for getting all products
productRoute.get('/api/products-by-category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const product = await Product.find({ category: category, popular: true });  //get all the banner present in the database
        if (!product || product.length === 0) {
            return res.status(404).json({ msg: "No product found" });
        }
        else {
            return res.status(200).json({ product });
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

productRoute.get('/api/products-by-subcategory/:subCategory', async (req, res) => {
    try {
        const { subCategory } = req.params;
        const product = await Product.find({ subCategory: subCategory });  //get all the banner present in the database
        if (!product || product.length === 0) {
            return res.status(404).json({ msg: "No product found" });
        }
        else {
            return res.status(200).json(product);
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

productRoute.get('/api/search-products', async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ msg: "Query parameter is missing" });
        }

        const product = await Product.find({
            $or: [{ productName: { $regex: query, $options: 'i' } },
            { category: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } }]
        });

        if (!product || product.length === 0) {
            return res.status(404).json({ msg: "No product found" });
        }

        return res.status(200).json(product);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

productRoute.put('/api/edit-product/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ msg: "Product not found" });
        }
        if (product.farmerId.toString() !== req.user.id) {
            return res.status(403).json({ msg: "You are not authorized to edit this product" });
        }

        const { farmerId, ...updateData } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { $set: updateData },
            { new: true });

        return res.status(200).json(updatedProduct);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

productRoute.get('/api/product/farmer/:farmerId', async (req, res) => {
    try {
        const { farmerId } = req.params;
        const farmerExists = await Farmer.findById(farmerId);

        if (!farmerExists) {
            return res.status(404).json({ msg: "Farmer with this id does not exist" });
        }
        const products = await Product.find({ farmerId: farmerId });
        if (!products || products.length === 0) {
            return res.status(404).json({ msg: "No products found" });
        }
        return res.status(200).json({ products });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


module.exports = productRoute;
