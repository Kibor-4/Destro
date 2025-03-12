const db = require('../../database/db'); // Import the MySQL connection

const analyticsController = {
  // Render the analytics page
  getAnalytics: async (req, res) => {
    try {
      // Fetch sales data for the chart
      const [salesChartData] = await db.query(`
        SELECT DATE(date) AS date, SUM(amount) AS total_sales
        FROM sales
        GROUP BY DATE(date)
        ORDER BY date
      `);

      // Fetch user activity data for the chart
      const [userActivityChartData] = await db.query(`
        SELECT DATE(date) AS date, COUNT(*) AS total_activities
        FROM user_activity
        GROUP BY DATE(date)
        ORDER BY date
      `);

      // Render the analytics view with data
      res.render('analytics', {
        salesChartData,
        userActivityChartData,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  },
};

module.exports = analyticsController;