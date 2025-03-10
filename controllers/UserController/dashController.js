// controllers/userDashboardController.js

const getPool = require('../../database/db');
const path = require('path');
const multer = require('multer');

// Multer configuration (keep this in the controller or a separate config file)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads/profile-pictures'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

async function getUserDashboard(req, res) {
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
}

async function updateUserProfile(req, res) {
    try {
        const pool = await getPool;
        const userId = req.user.id;
        const { name, email, phone } = req.body;
        let profilePicture = req.user.profilePicture;

        if (req.file) {
            profilePicture = `/uploads/profile-pictures/${req.file.filename}`;
        }

        await pool.query('UPDATE Users SET name = ?, email = ?, phone = ?, profilePicture = ? WHERE id = ?', [name, email, phone, profilePicture, userId]);

        res.redirect('/user_dashboard');
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).send('Server Error');
    }
}

async function markListingSold(req, res) {
    try {
        const pool = await getPool;
        const listingId = req.params.id;
        const userId = req.user.id;
        const { saleDate, salePrice } = req.body;

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
}

async function removeListing(req, res) {
    try {
        const pool = await getPool;
        const listingId = req.params.id;
        const userId = req.user.id;

        const [listing] = await pool.query('SELECT * FROM Properties WHERE id = ? AND user_id = ?', [listingId, userId]);
        if (listing.length === 0) {
            return res.status(403).send('Unauthorized');
        }

        await pool.query('DELETE FROM Properties WHERE id = ?', [listingId]);

        res.sendStatus(204);
    } catch (error) {
        console.error('Error removing listing:', error);
        res.status(500).send('Server Error');
    }
}

module.exports = {
    getUserDashboard,
    updateUserProfile: [upload.single('profilePicture'), updateUserProfile], //using array to add middleware to controller.
    markListingSold,
    removeListing
};
