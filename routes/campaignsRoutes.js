const express = require('express');
const Campaign = require('../models/Campaigns');
const User = require('../models/User'); // Import the User model for populating investor data
const router = express.Router();

// Create a campaign
router.post('/', async (req, res) => {
  const { title, goalAmount, description } = req.body;
  const companyId = req.user.userId; // assuming you're using authentication middleware

  try {
    const newCampaign = new Campaign({ title, goalAmount, description, companyId });
    await newCampaign.save();
    res.status(201).send('Campaign created');
  } catch (err) {
    res.status(500).send('Error creating campaign');
  }
});

// View a specific campaign with its details
router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('companyId', 'companyName') // Populating company name
      .populate('investors', 'name') // Populating investors' names
      .exec();

    if (!campaign) {
      return res.status(404).send('Campaign not found');
    }

    res.json(campaign);
  } catch (err) {
    res.status(500).send('Error fetching campaign details');
  }
});

// Fetch all campaigns and their investors
router.get('/', async (req, res) => {
  try {
    const campaigns = await Campaign.find()
      .populate('companyId', 'companyName') // Populate company name
      .populate('investors', 'name') // Populate investor names
      .exec();

    res.json(campaigns);
  } catch (err) {
    res.status(500).send('Error fetching campaigns');
  }
});

module.exports = router;
