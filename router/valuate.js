const express = require('express');
const router = express.Router();
const path = require('path');
const model = require('../model');
const labelEncoder = require('../labelEncoder');

router.get('/valuate', (req, res) => {
    res.render('valuate');
});

router.post('/valuate', (req, res) => {
    const { location, house_type, bedrooms, bathrooms } = req.body;

    const locationEncoded = labelEncoder.locationEncode(location);
    const houseTypeEncoded = labelEncoder.propertyTitleEncode(house_type);

    const features = [houseTypeEncoded, locationEncoded, parseFloat(bedrooms), parseFloat(bathrooms)];
    const prediction = model.predict(features);

    // Pass the prediction variable to the template
    res.render('valuate', { prediction: prediction });
});

module.exports = router;