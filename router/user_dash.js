const express = require('express');
const router = express.Router();
const isAuthenticated = require('./authmiddleware');
const getPool = require('../database/db');

router.get('/dashboard', isAuthenticated, async (req, res) => {
    console.log('Session in /admin/dashboard:', req.session);

    if (!req.session.userId) {
        return res.redirect('/login');
    }

    try {
        const pool = await getPool;

        const [Properties] = await pool.query(`
            SELECT * FROM Properties
            ORDER BY created_at DESC
            LIMIT 3;
        `);

        const recentListings = Properties.map(listing => {
            let imageArray = JSON.parse(listing.images || '[]');
            let imageUrl = imageArray.length > 0 ? imageArray[0] : '/Public/images/placeholder.jpg';
            return {
                ...listing,
                imageUrl: imageUrl,
            };
        });

        console.log("Recent Properties with Image URLs:", recentListings);

        const [totalProps] = await pool.query(`SELECT COUNT(*) AS total FROM Properties`);
        const totalProperties = totalProps[0].total;
        console.log("Total Properties:", totalProperties);

        const [activeListingsResult] = await pool.query(`SELECT COUNT(*) AS active FROM Properties`);
        const activeListings = activeListingsResult[0].active;
        console.log("Active Listings:", activeListings);

        const [totalUsersResult] = await pool.query(`SELECT COUNT(*) AS total FROM Users`);
        const totalUsers = totalUsersResult[0].total;
        console.log("Total Users:", totalUsers);

        const [revenueResult] = await pool.query(`SELECT SUM(Price) AS totalRevenue FROM Properties`);
        const revenue = revenueResult[0].totalRevenue || 0;
        console.log("Revenue:", revenue);

        const [listingRows] = await pool.query('SELECT * FROM Properties WHERE user_id = ?', [req.session.userId]);
        const listings = listingRows;

        res.render('user_dashboard', {
            title: 'Dashboard',
            recentListings: recentListings,
            totalProperties: totalProperties,
            activeListings: activeListings,
            totalUsers: totalUsers,
            revenue: revenue,
            user: req.session.user,
            listings: listings, // Add listings to the render data
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;