const getPool = require('../../database/db');

const submitProperty = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).send('Unauthorized: User ID not found.');
        }

        const userId = req.user.id;
        const { location, house_type, sqft, bedrooms, bathrooms, lot_size, price, description } = req.body;
        const images = req.files.map(file => '/Public/Uploads/uploads/' + file.filename);

        const pool = await getPool;
        await pool.query(
            'INSERT INTO Properties (location, house_type, sqft, bedrooms, bathrooms, lot_size, price, description, images, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [location, house_type, sqft, bedrooms, bathrooms, lot_size, price, description, JSON.stringify(images), userId]
        );

        res.send('Property added successfully!');
    } catch (error) {
        console.error('Error adding property:', error);
        res.status(500).send('Error adding property.');
    }
};

module.exports = { submitProperty };