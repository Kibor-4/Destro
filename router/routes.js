const express = require('express');
const router = express.Router();
const isAuthenticated = require('./authmiddleware'); // Import the middleware (adjust path if needed)

router.get('/', (req, res) => {
    res.render('index', { title: 'Home Page' });
});

router.get('/home', (req, res) => {
    res.render('home', { title: 'Home' });
});

router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

router.get('/signup', (req, res) => {
    res.render('signup', { title: 'Sign Up' });
});

router.get('/about', (req, res) => {
    res.render('about', { title: 'About Us' });
});

router.get('/valuate', (req, res) => {
    res.render('valuate', { title: 'Valuate' });
});

router.get('/sell', (req, res) => {
    res.render('sell', { title: 'Sell' });
});

router.get('/admin', (req, res) => {
    res.render('admin', { title: 'Admin' });
});


// Protected routes


router.get('/admin-dashboard', isAuthenticated, (req, res) => {
    res.render('admin-dashboard', { title: 'Admin Dashboard' });
});


module.exports = router;