const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const getPool = require('../database/db');
const fs = require('fs'); // For file logging

router.post('/', async (req, res) => {
    console.log('POST /login route hit');
    const { username, password } = req.body;

    try {
        const pool = await getPool;
        const [rows] = await pool.query('SELECT * FROM Users WHERE Username = ?', [username]);

        if (rows.length === 0) {
            console.log(`Login failed: User '${username}' does not exist.`);
            fs.appendFile('server.log', `Login failed: User '${username}' does not exist.\n`, (err) => { if (err) { console.log(err) } });
            return res.status(401).render('login', { error: 'User does not exist.' });
        }

        const user = rows[0];

        console.log("Plain Password:", password);
        console.log("Hashed Password from DB:", user.Password);

        if (!user.Password) {
            console.log(`Login failed: Database error, user password not found for '${username}'.`);
            fs.appendFile('server.log', `Login failed: Database error, user password not found for '${username}'.\n`, (err) => { if (err) { console.log(err) } });
            return res.status(500).render('login', { error: "Database error, user password not found." });
        }

        const passwordMatch = await bcrypt.compare(password, user.Password);

        if (!passwordMatch) {
            console.log(`Login failed: Incorrect password for '${username}'.`);
            fs.appendFile('server.log', `Login failed: Incorrect password for '${username}'.\n`, (err) => { if (err) { console.log(err) } });
            return res.status(401).render('login', { error: 'Incorrect password.' });
        }

        // Set session data
        req.session.user = user;
        req.session.userId = user.Id; // Explicitly set userId
        req.session.save((err) => { // Explicitly save the session with callback.
            if (err) {
                console.error('Error saving session:', err);
                fs.appendFile('server.log', `Error saving session: ${err.message}\n`, (error) => { if (error) { console.log(error) } });
                return res.status(500).send('Session save error');
            }

            console.log('Session saved successfully.');
            fs.appendFile('server.log', 'Session saved successfully.\n', (error) => { if (error) { console.log(error) } });
            console.log('Session after login:', req.session);
            fs.appendFile('server.log', `Session after login: ${JSON.stringify(req.session)}\n`, (error) => { if (error) { console.log(error) } });

            res.redirect('/user_dashboard'); // Redirect to dashboard on success
        });

    } catch (err) {
        console.error('Login error:', err);
        fs.appendFile('server.log', `Login error: ${err.message}\n`, (error) => { if (error) { console.log(error) } });
        res.status(500).send('Server Error');
    }
});

module.exports = router;