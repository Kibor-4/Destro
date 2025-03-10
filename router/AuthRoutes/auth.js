const express = require('express');
const router = express.Router();
const authController = require('../../controllers/AuthController/authcontroller');

router.get('/login', (req, res) => {
  res.render('login', { error: null, redirect: req.query.redirect }); // Pass redirect query parameter
});

router.post('/login', authController.login);
router.get('/signup', authController.signup);
router.post('/signup', authController.register);
router.get('/logout', authController.logout);

module.exports = router;