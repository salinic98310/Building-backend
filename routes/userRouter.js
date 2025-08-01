const express = require("express");
const { registerUser, loginUser, getProfile } = require("../controllers/auth");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
