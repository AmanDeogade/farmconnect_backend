const express = require('express');
const Farmer = require('../models/farmer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const farmerRouter = express.Router();

farmerRouter.post('/api/farmer/signup', async (req, res) => {
    try {
        const { fullName, email, password, state, city, area, agromethod, description } = req.body;

        const existingEmail = await Farmer.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ msg: "Farmer with same email already exists" });
        } else {
            const salt = await bcrypt.genSalt(10); 
            const hashedPassword = await bcrypt.hash(password, salt);
            let farmer = new Farmer({
                fullName,
                email,
                password: hashedPassword,
                state,
                city,
                area,
                agromethod, 
                description
            });
            farmer = await farmer.save();
            res.json({ farmer });
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

farmerRouter.post('/api/farmer/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const finduser = await Farmer.findOne({ email });

        if (!finduser) {
            return res.status(400).json({ msg: "farmer with this email does not exist" });
        }
        else {
            const isMatch = await bcrypt.compare(password, finduser.password);
            if (!isMatch) {
                return res.status(400).json({ msg: "Incorrect password" });
            } else {
                const token = jwt.sign({ id: finduser._id }, "passwordKey");
                const { password, ...farmerWithoutPassword } = finduser._doc;

                return res.json({ token, farmer: farmerWithoutPassword });
            }
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

farmerRouter.get('/api/farmer', async (req, res) => {
    try {
        const farmers = await Farmer.find().select('-password'); 
        return res.status(200).json(farmers);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
})

module.exports = farmerRouter;
