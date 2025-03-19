const express = require('express');
const router = express.Router();
const homeController = require('../../controllers/UserController/indexController');

// Home page
router.get('/', homeController.renderIndex);

// Endpoint to fetch recent listings
router.get('/api/recent-listings', homeController.getRecentListings);

// Handle search form redirect
router.post('/redirect', homeController.handleRedirect);

// Sell page
router.get('/sell', homeController.renderSell);

// Rent page
router.get('/rent', homeController.renderRent);

// Buy page
router.get('/buy', homeController.renderBuy);

module.exports = router;