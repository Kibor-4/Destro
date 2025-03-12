const db = require('../../database/db'); // Import the MySQL connection

const userController = {
  // Render the user management page
  getUsers: async (req, res) => {
    try {
      const [users] = await db.query('SELECT * FROM users'); // Fetch all users from the database
      res.render('userManagement', { users }); // Render the userManagement view with users data
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  },

  // Handle user deletion
  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;
      await db.query('DELETE FROM users WHERE id = ?', [userId]); // Delete the user by ID
      res.redirect('/admin/users'); // Redirect back to the user management page
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  },

  // Handle user editing
  editUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const { name, email, role } = req.body;

      // Update the user's information
      await db.query('UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?', [
        name,
        email,
        role,
        userId,
      ]);

      res.redirect('/admin/users'); // Redirect back to the user management page
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  },
};

module.exports = userController;