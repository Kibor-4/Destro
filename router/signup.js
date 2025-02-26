const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const getPool = require('../database/db'); // Import database pool

// Validation middleware
const validateUser = [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Route for submitting user signup data
router.post('/submit', validateUser, async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to the database
        const pool = await getPool;
        await pool.query(
            'INSERT INTO Users (Username, EMAIL, Password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        // Redirect to login page after successful signup
        res.redirect('/login'); // Redirect to the login route
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;