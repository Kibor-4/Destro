const bcrypt = require('bcrypt');
const getPool = require('../../database/db');
const { validationResult } = require('express-validator');

async function submitUser(req, res) {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const pool = await getPool;
    await pool.query('INSERT INTO Users (Username, EMAIL, Password) VALUES (?, ?, ?)', [
      username,
      email,
      hashedPassword,
    ]);

    res.redirect('/login');
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  submitUser,
};