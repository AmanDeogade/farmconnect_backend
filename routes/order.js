const express = require('express');
const orderRouter = express.Router();
const Order = require('../models/order');
// const {auth, vendorAuth} = require('../middleware/auth'); //import both at the same time

orderRouter.post('/api/orders', async (req, res) => {
    try {
        const {
            fullName,
            email,
            state,
            city,
            locality,
            productName,
            productPrice,
            quantity,
            category,
            image,
            buyerId,
            farmerId
        } = req.body; //extract image from the request the client will make

        const createdAt = new Date().getMilliseconds()

        const order = new Order({
            fullName,
            email,
            state,
            city,
            locality,
            productName,
            productPrice,
            quantity,
            category,
            image,
            createdAt,
            buyerId,
            farmerId
        });
        await order.save();
        return res.status(201).send(order); //send as object 
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }

});

orderRouter.get('/api/orders/:buyerId', async (req, res) => {
    try {
        const { buyerId } = req.params;
        const orders = await Order.find({ buyerId });
        if (orders.length === 0) {
            return res.status(404).json({ msg: "No orders found" });
        }

        return res.status(200).send(orders);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

orderRouter.get('/api/orders/farmer/:farmerId', async (req, res) => {
    try {
        const { farmerId } = req.params;
        const orders = await Order.find({ farmerId: farmerId });
        if (orders.length === 0) {
            return res.status(404).json({ msg: "No orders found" });
        }

        return res.status(200).send(orders);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

orderRouter.delete('/api/orders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) {
            return res.status(404).json({ msg: "Order not found" });
        }
        return res.status(200).json({ msg: "Order deleted successfully" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

orderRouter.patch('/api/orders/:id/delivered', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { delivered: true, processing: false },
            { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ msg: "Order not found" })
        } else {
            return res.status(200).json(updatedOrder);
        }
    } catch (error) {
        res.status(500).json({ error: e.message });
    }
});

orderRouter.patch('/api/orders/:id/processing', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { processing: false, delivered: false },
            { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ msg: "Order not found" })
        } else {
            return res.status(200).json(updatedOrder);
        }
    } catch (error) {
        res.status(500).json({ error: e.message });
    }
});

orderRouter.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find();
        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({ error: e.message });
    }
})

module.exports = orderRouter;