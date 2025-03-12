const db = require('../../database/db'); // Import the MySQL connection
const bcrypt = require('bcrypt'); // For password hashing

const settingsController = {
  // Render the settings page
  getSettings: async (req, res) => {
    try {
      res.render('settings'); // Render the settings view
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  },

  // Handle creating a new admin
  createAdmin: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the new admin into the database
      await db.query(
        'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
      );

      res.json({ success: true, message: 'Admin created successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error creating admin' });
    }
  },
};

module.exports = settingsController;