const express = require('express');
const User = require('../models/user');
const Farmer = require('../models/farmer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRouter = express.Router();

authRouter.post('/api/signup', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ msg: "user with same email already exists" });
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            let user = new User({
                fullName,
                email,
                password: hashedPassword
            });
            user = await user.save();
            res.json({ user });
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

authRouter.post('/api/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const finduser = await User.findOne({ email });

        if (!finduser) {
            return res.status(400).json({ msg: "user with this email does not exist" });
        }
        else {
            const isMatch = await bcrypt.compare(password, finduser.password);
            if (!isMatch) {
                return res.status(400).json({ msg: "Incorrect password" });
            } else {
                const token = jwt.sign({ id: finduser._id }, "passwordKey");
                const { password, ...userWithoutPassword } = finduser._doc;

                return res.json({ token, user: userWithoutPassword });
            }
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


authRouter.put('/api/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { state, city, locality } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            id, { state, city, locality },
            { new: true });

        if (!updatedUser) {
            return res.status(404).json({ msg: "user with this id does not exist" });
        }
        return res.status(200).json(updatedUser);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
})

authRouter.get('/api/user', async (req, res) => {
    try {
        const users = await User.find().select('-password'); 
        return res.status(200).json(users);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
})

authRouter.delete('/api/user/delete-account/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        const farmer = await Farmer.findById(id);

        if (!user && !farmer) {
            return res.status(404).json({ msg: "user with this id does not exist" });
        }
        if (user) {
            await User.findByIdAndDelete(id);
            return res.status(200).json({ msg: "user deleted successfully" });
        }
        else if (farmer) {
            await Farmer.findByIdAndDelete(id);
            return res.status(200).json({ msg: "farmer deleted successfully" });
        }

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
);

module.exports = authRouter;