const express = require('express');
const analyticsController = require('../../controllers/AdminController/analyticsController');

const router = express.Router();

// Route to render the analytics page
router.get('/admin/analytics', analyticsController.getAnalytics);

module.exports = router;