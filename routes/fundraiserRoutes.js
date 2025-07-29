const express = require("express");
const Fundraiser = require("../models/Fundraiser");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();

// Ensure the uploads folder exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up storage for multer to save files to a directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Give unique names to files
  }
});

const upload = multer({ storage });

// Middleware to check if the user is authenticated
const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user data to the request object
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

// POST: Submit a new fundraiser
router.post("/submit", authenticate, upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "video", maxCount: 1 },
  { name: "promoVideo", maxCount: 1 },
  { name: "promoPoster", maxCount: 1 }
]), async (req, res) => {
  try {
    const { userId } = req.user; // Get the logged-in user ID from the JWT token
    const {
      companyName,
      overview,
      purpose,
      state,
      city,
      pincode,
      moneyToRaise,
      fundingType,
      profitPercentage,
      daysToRaise,
      promotion
    } = req.body;

    // Check if files are provided and add their paths
    const photo = req.files?.photo ? req.files.photo[0].path : null;
    const video = req.files?.video ? req.files.video[0].path : null;
    const promoVideo = req.files?.promoVideo ? req.files.promoVideo[0].path : null;
    const promoPoster = req.files?.promoPoster ? req.files.promoPoster[0].path : null;

    // Create a new fundraiser document
    const newFundraiser = new Fundraiser({
      userId,
      companyName,
      overview,
      purpose,
      state,
      city,
      pincode,
      photo,
      video,
      promoVideo,
      promoPoster,
      promotion,
      moneyToRaise,
      fundingType,
      profitPercentage,
      daysToRaise
    });

    // Save the new fundraiser to the database
    await newFundraiser.save();

    res.status(201).json({ message: "Fundraiser created successfully", newFundraiser });
  } catch (error) {
    console.error("Error submitting fundraiser:", error);
    res.status(500).json({ message: "Error creating fundraiser", error: error.message });
  }
});

// GET: Get all fundraisers for a specific user
router.get("/:userId", authenticate, async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all fundraisers related to the user
    const fundraisers = await Fundraiser.find({ userId });

    if (!fundraisers || fundraisers.length === 0) {
      return res.status(404).json({ message: "No fundraisers found for this user." });
    }

    res.status(200).json(fundraisers);
  } catch (error) {
    console.error("Error fetching fundraisers:", error);
    res.status(500).json({ message: "Error fetching fundraisers", error: error.message });
  }
});

module.exports = router;
