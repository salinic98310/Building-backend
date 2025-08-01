const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userSchema.js");
const { protect, admin } = require("../middleware/authmiddleware.js");

const router = express.Router();

// Admin login route
// @route POST /api/admin/login
// @desc Admin login (using hardcoded credentials for simplicity)
// @access Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check if the provided email matches the admin email
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    try {
      // Generate JWT token for admin
      const token = jwt.sign(
        { email, role: "admin" },
        process.env.JWT_SECRET, // Use your JWT secret
        { expiresIn: "1h" }
      );
      res.status(200).json({ message: "Admin login successful", token });
    } catch (error) {
      console.error("Error during admin login:", error);
      res.status(500).json({ message: "Server error, please try again later." });
    }
  } else {
    res.status(400).json({ message: "Invalid admin credentials" });
  }
});

// @route GET /api/admin/users
// @desc Get all users (Admin only)
// @access Private/Admin
router.get("/", protect, admin, async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server error" });
    }
});

// @route POST /api/admin/users
// @desc Add a new user (admin only)
// @access Private/Admin
router.post("/", protect, admin,  async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        user = new User({
            name,
            email,
            password,
            role: role || "customer",
        });
        await user.save();
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server error" });
    }
});

// @route PUT /api/admin/users/:id
// @desc Update user details (Admin only)
// @access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;
        }
        const updatedUser = await user.save();
        res.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server error" });
    }
});

// @route DELETE /api/admin/users/:id
// @desc Delete a user
// @access Private/Admin
router.delete("/:id", protect, admin, async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await user.deleteOne();
            res.json({ message: "User deleted successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server error" });
    }
});

module.exports = router;
