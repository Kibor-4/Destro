const express = require('express');
const router = express.Router();


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

router.get('/valuate',(req,res) =>{
  res.render('valuate',{title:'valuate'})
});

router.get('/addproperty', (req, res) => {
  res.render('addproperty', { title: 'ADD' });
});

router.get('/sell',(req,res) =>{
  res.render('sell',{title:'sale'})
});
router.get('/admin',(req,res) =>{
  res.render('admin',{title:'sale'})
});
router.get('/dashboard',(req,res) =>{
  res.render('dashboard',{title:'sale'})
});
router.get('/adash',(req,res) =>{
  res.render('admin-dashboard',{title:'sale'})
});



module.exports = router;