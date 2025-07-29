const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import Routes
const authRoutes = require('./routes/authRoutes');
const fundraiserRoutes = require('./routes/fundraiserRoutes');  // Correct import

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse incoming JSON requests

// Routes
app.use('/api/auth', authRoutes); // Authentication Routes
app.use('/api/fundraiser', fundraiserRoutes); // Correct endpoint for fundraisers

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Gracefully shut down server if DB connection fails
  });

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
