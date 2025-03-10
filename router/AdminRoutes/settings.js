const express = require('express');
const router = express.Router();
const settingsController = require('../../controllers/AdminController/settingsController');
const { ensureAuthenticated, ensureAdmin } = require('../../Middleware/authmiddleware');

router.get('/admin/settings', ensureAuthenticated, ensureAdmin, settingsController.getSettings);
router.post('/admin/create-admin', ensureAuthenticated, ensureAdmin, settingsController.createAdmin);

module.exports = router;