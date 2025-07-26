const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Register User Route
router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword, role } = req.body;

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  // Create new user
  const newUser = new User({
    name,
    email,
    password,
    role,
  });

  try {
    // Save user to database
    await newUser.save();
    res.status(201).json({ message: 'Registration successful. You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

// Login User Route
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Check if password matches
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Role validation (optional, depending on your use case)
  if (role && role !== user.role) {
    return res.status(400).json({ message: `User role mismatch. Expected ${user.role}.` });
  }

  // Generate JWT Token
  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.status(200).json({ message: 'Login successful', token });
});

module.exports = router;
