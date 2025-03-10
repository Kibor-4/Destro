const dbPromise = require('../database/db'); // Assuming your db.js path

const analyticsController = {
  getAnalytics: async (req, res) => {
    try {
      const db = await dbPromise;

      // Sample Data - Replace with your actual database queries
      const salesData = await getSalesData(db);
      const activityData = await getUserActivityData(db);

      res.render('analytics', {
        user: req.session.user, // Assuming user info is stored in session
        salesData: salesData,
        activityData: activityData,
      });
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).send('Error fetching analytics data.');
    }
  },
};

async function getSalesData(db) {
  // Replace with your actual database query to fetch sales data
  // Example:
  const [salesResults] = await db.query('SELECT DATE(sale_date) as date, SUM(amount) as total FROM sales GROUP BY DATE(sale_date)');

  const labels = salesResults.map((row) => row.date.toISOString().split('T')[0]);
  const data = salesResults.map((row) => row.total);

  return { labels: labels, data: data };
}

async function getUserActivityData(db) {
  // Replace with your actual database query to fetch user activity data
  // Example:
  const [activityResults] = await db.query('SELECT activity_type, COUNT(*) as count FROM user_activity GROUP BY activity_type');

  const labels = activityResults.map((row) => row.activity_type);
  const data = activityResults.map((row) => row.count);

  return { labels: labels, data: data };
}

module.exports = analyticsController;