const express = require('express');
const Campaign = require('../models/Campaign');
const User = require('../models/User');
const adminAuth = require('../middleware/authmiddleware');
const router = express.Router();

// Example: Get all campaigns (Admin dashboard functionality)
router.get('/campaigns', adminAuth, async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.status(200).json(campaigns);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching campaigns', error: err });
  }
});

// Example: Get all users (Admin dashboard functionality)
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err });
  }
});

module.exports = router;
