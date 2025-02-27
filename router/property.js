const express = require('express');
const router = express.Router();
const getPool = require('../database/db');
const isAuthenticated = require('../router/authmiddleware'); // Assuming your auth middleware is here

router.get('/property/:id', async (req, res) => {
    const propertyId = req.params.id;

    try {
        const pool = await getPool;

        // Fetch property details
        const [propertyRows] = await pool.query(`
            SELECT 
                id, sqft, price, lot_size, location, images, house_type, 
                description, created_at, bedrooms, bathrooms
            FROM Properties
            WHERE id = ?
        `, [propertyId]);

        if (propertyRows.length === 0) {
            return res.status(404).send('Property not found.');
        }

        const property = propertyRows[0];

        // Parse images (handle null or empty string)
        property.images = property.images ? JSON.parse(property.images) : [];

        // Ensure price is a number
        property.price = parseFloat(property.price);

        // Fetch reviews for the property
        const [reviewRows] = await pool.query(`
            SELECT reviews.*, users.username 
            FROM reviews 
            JOIN users ON reviews.user_id = users.id 
            WHERE property_id = ? 
            ORDER BY created_at DESC
        `, [propertyId]);

        // Pass the user object from the session if it exists.
        const user = req.session.user;

        // Render the property details page with property, reviews, and user
        res.render('property-details', { property, reviews: reviewRows, user: user });

    } catch (err) {
        console.error('Error fetching property details:', err);
        res.status(500).send('Server error occurred while fetching property details.');
    }
});

// Add this route handler for POST /properties/:id/reviews
router.post('/properties/:id/reviews', isAuthenticated, async (req, res) => {
    const propertyId = req.params.id;
    const { rating, comment } = req.body;
    const userId = req.session.userId; // Assuming userId is in your session

    try {
        const pool = await getPool;
        await pool.query('INSERT INTO reviews (property_id, user_id, rating, comment) VALUES (?, ?, ?, ?)', [propertyId, userId, rating, comment]);
        res.redirect(`/property/${propertyId}`); // Redirect back to the property details page
    } catch (err) {
        console.error('Error adding review:', err);
        res.status(500).send('Server error occurred while adding review.');
    }
});

module.exports = router;