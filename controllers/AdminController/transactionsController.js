
const dbPromise = require('../../database/db');

const transactionController = {
  getTransactionManagement: async (req, res) => {
    try {
      const db = await dbPromise;

      // Fetch all transactions from the database, including property and buyer details
      const [transactions] = await db.query(`
        SELECT 
          Transactions.id,
          Properties.location AS property,
          Users.name AS buyer,
          Transactions.amount,
          Transactions.date,
          Transactions.status
        FROM Transactions
        JOIN Properties ON Transactions.property_id = Properties.id
        JOIN Users ON Transactions.buyer_id = Users.Id
      `);

      res.render('transactionManagement', {
        user: req.session.user,
        transactions: transactions,
      });
    } catch (error) {
      console.error('Transaction management error:', error);
      res.status(500).send('Error fetching transaction data.');
    }
  },
};

module.exports = transactionController;