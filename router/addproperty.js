const express = require('express');
const router = express.Router();
const path = require('path');
const getPool = require('../database/db');
const upload = require('../Public/Uploads/multer');
const isAuthenticated = require('./authmiddleware');
require('dotenv').config();

router.get('/addproperty', isAuthenticated, (req, res) => {
    res.render('addproperty');
});

router.post('/submit', isAuthenticated, upload.array('images'), async (req, res) => {
    try {
        // Ensure user is authenticated and req.user.id is available
        if (!req.user || !req.user.id) {
            return res.status(401).send('Unauthorized: User ID not found.');
        }

        const userId = req.user.id; // Get user ID from req.user (populated by isAuthenticated)
        const { location, house_type, sqft, bedrooms, bathrooms, lot_size, price, description } = req.body;
        const images = req.files.map(file => '/Public/Uploads/uploads/' + file.filename);

        const pool = await getPool;
        await pool.query(
            'INSERT INTO Properties (location, house_type, sqft, bedrooms, bathrooms, lot_size, price, description, images, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [location, house_type, sqft, bedrooms, bathrooms, lot_size, price, description, JSON.stringify(images), userId]
        );

        res.send('Property added successfully!');
    } catch (error) {
        console.error('Error adding property:', error);
        res.status(500).send('Error adding property.');
    }
});

module.exports = router;