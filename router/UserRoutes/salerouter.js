const express = require('express');
const router = express.Router();
const propertyListController = require('../../controllers/UserController/saleController');

router.get('/all', propertyListController.getAllProperties);
router.get('/active', propertyListController.getActiveProperties);
router.get('/sold', propertyListController.getSoldProperties);

module.exports = router;