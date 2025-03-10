const dbPromise = require('../../database/db'); // Assuming your db.js path

const adminController = {
  getDashboard: async (req, res) => {
    try {
      const db = await dbPromise;

      // Fetch dashboard stats from the database
      const stats = await getDashboardStats(db);

      res.render('adminDashboard', {
        user: req.session.user, // Assuming user info is stored in session
        stats: stats,
      });
    } catch (error) {
      console.error('Admin dashboard error:', error);
      res.status(500).send('Error fetching dashboard data.');
    }
  },
};

async function getDashboardStats(db) {
  try {
    // Fetch total properties
    const [propertiesResults] = await db.query('SELECT COUNT(*) as total FROM Properties');
    const totalProperties = propertiesResults[0].total;

    // Fetch total users
    const [usersResults] = await db.query('SELECT COUNT(*) as total FROM Users');
    const totalUsers = usersResults[0].total;

    // Fetch total transactions (sum of prices from properties)
    const [transactionsResults] = await db.query('SELECT SUM(price) as total FROM Properties');
    const totalTransactions = transactionsResults[0].total || 0; // Handle null case

    return {
      totalProperties: totalProperties,
      totalUsers: totalUsers,
      totalTransactions: totalTransactions,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error; // Re-throw to be caught by the main try-catch
  }
}

module.exports = adminController;