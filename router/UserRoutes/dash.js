const express = require('express');
const router = express.Router();
const userDashboardController = require('../../controllers/UserController/dashController');
const isAuthenticated = require('../../Middleware/authmiddleware');

router.get('/user_dashboard', isAuthenticated, userDashboardController.getUserDashboard);
router.post('/dashboard/profile', isAuthenticated, userDashboardController.updateUserProfile);
router.post('/listings/:id/sold', isAuthenticated, userDashboardController.markListingSold);
router.delete('/listings/:id/remove', isAuthenticated, userDashboardController.removeListing);

module.exports = router;