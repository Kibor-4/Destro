const dbPromise = require('../../database/db');
const bcrypt = require('bcrypt');

const settingsController = {
  getSettings: async (req, res) => {
    try {
      res.render('settings', { user: req.session.user });
    } catch (error) {
      console.error('Settings error:', error);
      res.status(500).send('Error rendering settings page.');
    }
  },

  createAdmin: async (req, res) => {
    try {
      const db = await dbPromise;
      const { name, email, password } = req.body;

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the new admin into the database
      await db.query('INSERT INTO Users (name, EMAIL, Password, role) VALUES (?, ?, ?, ?)', [name, email, hashedPassword, 'admin']);

      res.redirect('/admin/settings'); // Redirect back to settings page
    } catch (error) {
      console.error('Create admin error:', error);
      res.status(500).send('Error creating admin.');
    }
  },
};

module.exports = settingsController;