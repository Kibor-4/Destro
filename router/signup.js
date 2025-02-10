const express = require('express');
const router = express.Router();
const db = require('../database/db'); // Assuming you have a database connection module
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

// POST /submit
router.post('/', async (req, res) => {
  const { username, email, dateOfBirth, password } = req.body;

  // Check for missing fields
  const missingFields = [];
  if (!username) missingFields.push('username');
  if (!email) missingFields.push('email');
  if (!dateOfBirth) missingFields.push('dateOfBirth');
  if (!password) missingFields.push('password');

  // If any fields are missing, return an error with the list of missing fields
  if (missingFields.length > 0) {
    return res.status(400).json({ 
      error: 'Some fields are missing', 
      missingFields: missingFields 
    });
  }

  // Convert "mm/dd/yyyy" to MySQL format ("YYYY-MM-DD")
  const dobDate = new Date(dateOfBirth);
  const today = new Date();
  const age = today.getFullYear() - dobDate.getFullYear();

  if (age < 18) {
    return res.status(400).json({ error: 'You must be at least 18 years old.' });
  }

  try {
    // Check if username already exists
    db.query('SELECT * FROM Users WHERE username = ?', [username], async (error, rows) => {
      if (error) {
        console.error('Database error while checking username:', error);
        return res.status(500).json({ error: 'Server error. Please try again later.' });
      }

      if (rows.length > 0) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      // Hash the password using bcrypt
      const saltRounds = 10; // Number of salt rounds for hashing
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insert user into database with the hashed password
      db.query(
        'INSERT INTO Users (Username, Email, Date_of_Birth, Password) VALUES (?, ?, ?, ?)',
        [username, email, dateOfBirth, hashedPassword],
        (error, result) => {
          if (error) {
            console.error('Database error while inserting user:', error);
            return res.status(500).json({ error: 'Server error. Please try again later.' });
          }

          console.log('User registered successfully:', { username, email, dateOfBirth });
          res.status(201).json({ message: 'User registered successfully', data: req.body });
        }
      );
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

module.exports = router;