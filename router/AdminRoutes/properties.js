const express = require('express');
const router = express.Router();
const propertyController = require('../../controllers/AdminController/propertyController');
//const { ensureAuthenticated, ensureAdmin } = require('../../Middleware/authmiddleware'); // Import your authentication middleware

// Apply middleware to protect the routes
router.get('/admin/properties',      propertyController.getProperties);
router.get('/admin/properties/delete/:id',   propertyController.getDeleteProperty);

module.exports = router;