const express = require('express');
const router = express.Router();
const getPool = require('../database/db');

router.get('/property/:id', async (req, res) => {
    const propertyId = req.params.id;

    try {
        const pool = await getPool;
        const [rows] = await pool.query(`
            SELECT 
                id, sqft, price, lot_size, location, images, house_type, 
                description, created_at, bedrooms, bathrooms
            FROM Properties
            WHERE id = ?
        `, [propertyId]);

        if (rows.length > 0) {
            const property = rows[0];
            property.images = JSON.parse(property.images || '[]'); // Parse images from JSON string.
            property.price = parseFloat(property.price); //Ensure price is a number.

            res.render('property-details', { property: property });
        } else {
            res.status(404).send('Property not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;