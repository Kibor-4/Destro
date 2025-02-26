// salerouter.js
const express = require('express');
const router = express.Router();
const getPool = require('../database/db');

async function fetchProperties(req, res, queryBase, queryParamsBase = []) {
    try {
        const pool = await getPool;
        let query = queryBase;
        let queryParams = [...queryParamsBase];

        const location = req.query.location || '';
        const propertyType = req.query.propertyType || 'Any';

        console.log('Location:', location);
        console.log('PropertyType:', propertyType);
        console.log('Query:', query);
        console.log('QueryParams:', queryParams);

        if (location) {
            query += ' AND location LIKE ?';
            queryParams.push(`%${location}%`);
        }

        if (propertyType && propertyType !== 'Any') {
            query += ' AND house_type = ?';
            queryParams.push(propertyType);
        }

        if (req.query.house_type) {
            query += ' AND house_type = ?';
            queryParams.push(req.query.house_type);
        }

        if (req.query.min_price) {
            query += ' AND price >= ?';
            queryParams.push(req.query.min_price);
        }

        if (req.query.max_price) {
            query += ' AND price <= ?';
            queryParams.push(req.query.max_price);
        }

        if (req.query.bedrooms) {
            query += ' AND bedrooms = ?';
            queryParams.push(req.query.bedrooms);
        }

        if (req.query.bathrooms) {
            query += ' AND bathrooms = ?';
            queryParams.push(req.query.bathrooms);
        }

        const [rows] = await pool.query(query, queryParams);

        console.log('Rows:', rows);

        const properties = rows.map(property => ({
            ...property,
            images: JSON.parse(property.images)
        }));

        res.render('sale', {
            properties: properties,
            query: req.query,
            req: req,
            location: location,
            propertyType: propertyType
        });
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).send('Server error');
    }
}

router.get('/all', async (req, res) => {
    await fetchProperties(req, res, 'SELECT * FROM Properties WHERE 1=1');
});

router.get('/active', async (req, res) => {
    await fetchProperties(req, res, 'SELECT * FROM Properties WHERE status = ?', ['Active']);
});

router.get('/sold', async (req, res) => {
    await fetchProperties(req, res, 'SELECT * FROM Properties WHERE status = ?', ['Sold']);
});

module.exports = router;