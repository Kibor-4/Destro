const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); 
//const connection = require('../app').connection; 

router.get('/', (req, res) => {
  res.render('login', { error: null }); 
});

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await connection.promise().query('SELECT * FROM users WHERE username = ?', [username]);

    if (rows.length === 0) {
      return res.status(401).render('login', { error: 'Invalid username' });
    }

    const user = rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password); 

    if (!passwordMatch) {
      return res.status(401).render('login', { error: 'Invalid password' });
    }

    // Authentication successful - (Replace with session/JWT handling)
    req.session.user = user; // Example: Set session data 
    res.redirect('/login'); // Redirect to protected area

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error'); 
  }
});

module.exports = router;