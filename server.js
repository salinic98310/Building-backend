const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { decodeToken } = require("./middleware/authmiddleware"); // Assuming you have an auth middleware for protection
// Import Routes
const authRoutes = require("./routes/userRouter");
const fundRaiserRouter = require("./routes/fundraiserRoutes");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

 
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies

// Routes
app.use("/api/auth", authRoutes); // Authentication Routes
app.use("/api/fundraiser", fundRaiserRouter); // Correct endpoint for fundraisers

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Gracefully shut down server if DB connection fails
  });

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
