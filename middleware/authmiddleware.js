const jwt = require("jsonwebtoken");
const User = require("../models/userSchema.js");

// Middleware to protect routes (requires valid JWT token)
const decodeToken = async (req, res, next) => {
  let token;
  console.log('token', token)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
      // Verify token structure
      if (token.split(".").length !== 3) {
        return res.status(401).json({ message: "Invalid token format" });
      }

      // Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Extract user ID from token (handle both possible structures)
      const userId = decoded?.user?.id || decoded?.id;

      if (!userId) {
        return res.status(401).json({ message: "Invalid token payload" });
      }

      // Fetch user and exclude password field
      const user = await User.findById(userId).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Token verification failed:", error);

      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }

      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token" });
      }

      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided" });
  }
};

// Middleware to check admin or merchandise access
const admin = (req, res, next) => {
  const userRole = req.user?.role;
  if (userRole === "admin" || userRole === "merchantise") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

module.exports = { decodeToken, admin };