const express = require('express');
const router = express.Router();
const analyticsController = require('../../controllers/AdminController/analyticsController');
const { ensureAuthenticated, ensureAdmin } = require('../../Middleware/authmiddleware'); // Import your authentication middleware

// Apply middleware to protect the route
router.get('/analytics', ensureAuthenticated, ensureAdmin, analyticsController.getAnalytics);

module.exports = router;