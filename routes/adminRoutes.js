const express = require('express');
const {AdminDashboard} = require('../controllers/adminController/AdminDashboard.js');
const { decodeToken , isAdmin } = require('../middleware/authmiddleware.js');

const router = express.Router();

router.get('/dashboard', decodeToken, AdminDashboard);

module.exports = router;