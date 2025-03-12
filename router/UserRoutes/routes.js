const express = require('express');
const router = express.Router();



router.get('/about', (req, res) => {
    res.render('about', { title: 'About Us' });
});

router.get('/admin',(req,res) => {
    res,render('dashboard',{title:'Dashboard'})
});

module.exports=router;
