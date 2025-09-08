const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

require('dotenv').config();

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, plan } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'Email already exists!' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, password: hashedPassword, plan });

        await user.save();

        res.status(201).json({ message: "Successfully signed up!" });
    }
    catch (err) {
        res.status(500).json({ error: 'Server error',detailed_error:err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (!existingUser) return res.status(400).json({ error: "User does not exists!" });

        const isMatch = await bcrypt.compare(password, existingUser.password)
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign(
            { id: existingUser.id, role: existingUser.role, plan: existingUser.plan },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ token, user: { id: existingUser.id, name: existingUser.name, role: existingUser.role } });
    }
    catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;