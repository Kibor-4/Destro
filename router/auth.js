const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const getPool = require('../database/db');
const fs = require('fs');

router.post('/', async (req, res) => {
    console.log('POST /login route hit');
    const { username, password } = req.body;

    try {
        const pool = await getPool;
        const [rows] = await pool.query('SELECT * FROM Users WHERE LOWER(Username) = LOWER(?)', [username]); // Case-insensitive

        if (rows.length === 0) {
            console.log(`Login failed: User '${username}' does not exist.`);
            fs.appendFile('server.log', `Login failed: User '${username}' does not exist.\n`, (err) => { if (err) { console.error('File log error:', err); } });
            return res.status(401).render('login', { error: 'Invalid username or password.' });
        }

        const user = rows[0];

        if (!user.Password) {
            console.log(`Login failed: Database error, user password not found for '${username}'.`);
            fs.appendFile('server.log', `Login failed: Database error, user password not found for '${username}'.\n`, (err) => { if (err) { console.error('File log error:', err); } });
            return res.status(500).render('login', { error: "An error occurred during login." });
        }

        const passwordMatch = await bcrypt.compare(password, user.Password);

        if (!passwordMatch) {
            console.log(`Login failed: Incorrect password for '${username}'.`);
            fs.appendFile('server.log', `Login failed: Incorrect password for '${username}'.\n`, (err) => { if (err) { console.error('File log error:', err); } });
            return res.status(401).render('login', { error: 'Invalid username or password.' });
        }

        req.session.regenerate((err) => {
            if (err) {
                console.error('Session regenerate error:', err);
                fs.appendFile('server.log', `Session regenerate error: ${err.message}\n`, (error) => { if (error) { console.error('File log error:', error); } });
                return res.status(500).send('Session error');
            }
            req.session.user = user;
            req.session.userId = user.Id;

            req.session.save((saveErr) => {
                if (saveErr) {
                    console.error('Error saving session:', saveErr);
                    fs.appendFile('server.log', `Error saving session: ${saveErr.message}\n`, (error) => { if (error) { console.error('File log error:', error); } });
                    return res.status(500).send('Session save error');
                }

                console.log('Session saved successfully.');
                fs.appendFile('server.log', 'Session saved successfully.\n', (error) => { if (error) { console.error('File log error:', error); } });
                console.log('Session after login:', req.session);
                fs.appendFile('server.log', `Session after login: ${JSON.stringify(req.session)}\n`, (error) => { if (error) { console.error('File log error:', error); } });

                // Redirect to the stored URL or a default (e.g., '/dashboard')
                const redirectTo = req.session.redirectTo || '/dashboard';
                delete req.session.redirectTo; // Clear the stored URL
                res.redirect(redirectTo);
            });
        });

    } catch (err) {
        console.error('Login error:', err);
        fs.appendFile('server.log', `Login error: ${err.message}\n`, (error) => { if (error) { console.error('File log error:', error); } });
        res.status(500).send('An unexpected error occurred.');
    }
});

module.exports = router;