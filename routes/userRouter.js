const express = require('express');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authmiddleware.js');
const User = require('../models/userSchema.js');

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
    const { username, name, email, password } = req.body;
    try {
        // Check if the email is already used
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create a new user
        user = new User({ username, name, email, password });
        await user.save();

        const payload = {
            id: user._id,
        };

        // Sign the token and return the token along with user data
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '40h' }, (err, token) => {
            if (err) {
                console.error("JWT signing error:", err);
                return res.status(500).json({ message: 'Error signing token' });
            }
            res.status(201).json({
                message: 'User registered successfully',
                user: {
                    id: user._id,
                    username: user.username,
                    name: user.name,
                    email: user.email,
                },
                token,
            });
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Find user by email or username
        let user;
        if (email) {
            user = await User.findOne({ email });
        } else if (username) {
            user = await User.findOne({ username });
        }

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check if the password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const payload = {
            id: user._id,
        };

        // Sign the token and return the token along with user data
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '40h' }, (err, token) => {
            if (err) {
                console.error("JWT signing error:", err);
                return res.status(500).json({ message: 'Error signing token' });
            }
            res.status(200).json({
                message: 'User logged in successfully',
                user: {
                    id: user._id,
                    username: user.username,
                    name: user.name,
                    email: user.email,
                },
                token,
            });
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Error logging in user', error });
    }
});

// Profile Route (Protected Route)
router.get('/profile', protect, async (req, res) => {
    res.json(req.user); // Send the user info based on JWT token
});

module.exports = router;
