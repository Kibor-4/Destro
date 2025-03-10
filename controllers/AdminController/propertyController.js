const dbPromise = require('../../database/db'); // Assuming your db.js path

const propertyController = {
  getPropertyManagement: async (req, res) => {
    try {
      const db = await dbPromise;

      // Fetch all properties from the database
      const [properties] = await db.query('SELECT id, location as title, house_type as type, price, status FROM Properties'); // Adjust column names as needed

      res.render('propertyManagement', {
        user: req.session.user, // Assuming user info is stored in session
        properties: properties,
      });
    } catch (error) {
      console.error('Property management error:', error);
      res.status(500).send('Error fetching property data.');
    }
  },

  getAddProperty: async (req, res) => {
    try {
      res.render('addProperty', { user: req.session.user });
    } catch (error) {
      console.error('Add property error:', error);
      res.status(500).send('Error rendering add property page.');
    }
  },

  postAddProperty: async (req, res) => {
    try {
      const db = await dbPromise;
      const { title, type, price, status } = req.body;

      await db.query('INSERT INTO Properties (location, house_type, price, status) VALUES (?, ?, ?, ?)', [title, type, price, status]); // Adjust column names as needed

      res.redirect('/admin/properties');
    } catch (error) {
      console.error('Add property error:', error);
      res.status(500).send('Error adding property.');
    }
  },

  getEditProperty: async (req, res) => {
    try {
      const db = await dbPromise;
      const { id } = req.params;

      const [properties] = await db.query('SELECT id, location as title, house_type as type, price, status FROM Properties WHERE id = ?', [id]); // Adjust column names as needed

      if (properties.length === 0) {
        return res.status(404).send('Property not found.');
      }

      res.render('editProperty', { user: req.session.user, property: properties[0] });
    } catch (error) {
      console.error('Edit property error:', error);
      res.status(500).send('Error fetching property for editing.');
    }
  },

  postEditProperty: async (req, res) => {
    try {
      const db = await dbPromise;
      const { id } = req.params;
      const { title, type, price, status } = req.body;

      await db.query('UPDATE Properties SET location = ?, house_type = ?, price = ?, status = ? WHERE id = ?', [title, type, price, status, id]); // Adjust column names as needed

      res.redirect('/admin/properties');
    } catch (error) {
      console.error('Edit property error:', error);
      res.status(500).send('Error updating property.');
    }
  },

  getDeleteProperty: async (req, res) => {
    try {
      const db = await dbPromise;
      const { id } = req.params;

      await db.query('DELETE FROM Properties WHERE id = ?', [id]);

      res.redirect('/admin/properties');
    } catch (error) {
      console.error('Delete property error:', error);
      res.status(500).send('Error deleting property.');
    }
  },
};

module.exports = propertyController;