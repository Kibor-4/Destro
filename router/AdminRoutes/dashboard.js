const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/AdminController/dashboardController');
const { ensureAuthenticated, ensureAdmin } = require('../../Middleware/authmiddleware'); // Import your authentication middleware

// Apply middleware to protect the route
router.get('/admin/dashboard', dashboardController.getDashboard);

module.exports = router;