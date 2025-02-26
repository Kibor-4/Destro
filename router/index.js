const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.post('/redirect', (req, res) => {
    const action = req.body.action;
    const location = req.body.location;
    const propertyType = req.body.propertyType;

    let redirectURL = '';

    switch (action) {
        case 'sell':
            redirectURL = `/all?location=<span class="math-inline">\{location\}&propertyType\=</span>{propertyType}`;
            break;
        case 'rent':
            redirectURL = `/rent?location=<span class="math-inline">\{location\}&propertyType\=</span>{propertyType}`;
            break;
        case 'buy':
            redirectURL = `/buy?location=<span class="math-inline">\{location\}&propertyType\=</span>{propertyType}`;
            break;
        default:
            res.send('Invalid action');
            return;
    }

    res.redirect(redirectURL);
});

router.get('/sell', (req, res) => {
    const location = req.query.location;
    const propertyType = req.query.propertyType;
    res.render('all', { location: location, propertyType: propertyType });
});

router.get('/rent', (req, res) => {
    const location = req.query.location;
    const propertyType = req.query.propertyType;
    res.render('rent', { location: location, propertyType: propertyType });
});

router.get('/buy', (req, res) => {
    const location = req.query.location;
    const propertyType = req.query.propertyType;
    res.render('buy', { location: location, propertyType: propertyType });
});

module.exports = router;