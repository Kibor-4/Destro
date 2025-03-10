const express = require('express');
const router = express.Router();
const transactionController = require('../../controllers/AdminController/transactionsController');
const { ensureAuthenticated, ensureAdmin } = require('../../Middleware/authmiddleware');

router.get('/admin/transactions', ensureAuthenticated, ensureAdmin, transactionController.getTransactionManagement);

module.exports = router;