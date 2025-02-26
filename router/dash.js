const express = require('express');
const router = express.Router(); // Assuming you're using Express Router
const getPool = require('../database/db'); // Your database connection pool
const isAuthenticated = require('./authmiddleware'); // Your authentication middleware
const path = require('path'); // For file uploads
const multer = require('multer'); // For file uploads

// Multer configuration for profile picture uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads/profile-pictures')); // Adjust the path as needed
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Dashboard route
router.get('/user_dashboard', isAuthenticated, async (req, res) => {
    try {
        const pool = await getPool;
        const userId = req.user.id;
        const [user] = await pool.query('SELECT * FROM Users WHERE id = ?', [userId]);
        //const [listings] = await pool.query('SELECT * FROM Properties WHERE user_id = ?', [userId]);

        res.render('user_dashboard', { user: user[0], listings });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).send('Server Error');
    }
});

// Profile update route with file upload
router.post('/dashboard/profile', isAuthenticated, upload.single('profilePicture'), async (req, res) => {
    try {
        const pool = await getPool;
        const userId = req.user.id;
        const { name, email, phone } = req.body;
        let profilePicture = req.user.profilePicture; // Keep existing if not updated

        if (req.file) {
            profilePicture = `/uploads/profile-pictures/${req.file.filename}`; // Store relative path
        }

        await pool.query('UPDATE Users SET name = ?, email = ?, phone = ?, profilePicture = ? WHERE id = ?', [name, email, phone, profilePicture, userId]);

        res.redirect('/dashboard'); // Redirect to dashboard after update
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).send('Server Error');
    }
});

// Listing management routes (mark as sold, remove, edit)
router.post('/listings/:id/sold', isAuthenticated, async (req, res) => {
    try {
        const pool = await getPool;
        const listingId = req.params.id;
        const userId = req.user.id;
        const { saleDate, salePrice } = req.body;

        // Verify ownership
        const [listing] = await pool.query('SELECT * FROM Properties WHERE id = ? AND user_id = ?', [listingId, userId]);
        if (listing.length === 0) {
            return res.status(403).send('Unauthorized');
        }

        await pool.query('UPDATE Properties SET status = "Sold", date_sold = ?, sale_price = ? WHERE id = ?', [saleDate, salePrice, listingId]);

        res.redirect('/user_dashboard');
    } catch (error) {
        console.error('Error marking listing as sold:', error);
        res.status(500).send('Server Error');
    }
});

router.delete('/listings/:id/remove', isAuthenticated, async (req, res) => {
    try {
        const pool = await getPool;
        const listingId = req.params.id;
        const userId = req.user.id;

        // Verify ownership
        const [listing] = await pool.query('SELECT * FROM Properties WHERE id = ? AND user_id = ?', [listingId, userId]);
        if (listing.length === 0) {
            return res.status(403).send('Unauthorized');
        }

        await pool.query('DELETE FROM Properties WHERE id = ?', [listingId]);

        res.sendStatus(204); // No content (successful deletion)
    } catch (error) {
        console.error('Error removing listing:', error);
        res.status(500).send('Server Error');
    }
});

// Add edit listing route here as needed

module.exports = router;
