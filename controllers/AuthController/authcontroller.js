const bcrypt = require('bcrypt');
const dbPromise = require('../../database/db');

const authController = {
    login: async (req, res) => {
        try {
            const db = await dbPromise;
            const { username, password, redirect } = req.body;

            if (!username || !password) {
                return res.render('login', { error: 'Username and password are required', redirect });
            }

            let query = 'SELECT * FROM users WHERE Username = ? OR EMAIL = ? OR phone = ?';
            const [results] = await db.query(query, [username, username, username]);

            if (results.length === 0) {
                return res.render('login', { error: 'Invalid username or password', redirect });
            }

            const user = results[0];

            const passwordMatch = await bcrypt.compare(password, user.Password);

            if (!passwordMatch) {
                return res.render('login', { error: 'Invalid username or password', redirect });
            }

            req.session.userId = user.Id;
            req.session.role = user.role;

            if (redirect) {
                return res.redirect(redirect);
            } else {
                return res.redirect('/');
            }
        } catch (error) {
            console.error('Login error:', error);
            return res.render('login', { error: 'An error occurred during login', redirect: req.body.redirect });
        }
    },
    signup: async (req, res) => {
        try {
            res.render('signup');
        } catch (err) {
            console.log(err);
            res.status(500).send('error');
        }
    },

    register: async (req, res) => {
      try {
          const db = await dbPromise;
          const { username, email, password, phone, dob } = req.body;
  
          if (!username || !email || !password || !phone || !dob) {
              return res.render('signup', { error: 'All fields are required' });
          }
  
          const hashedPassword = await bcrypt.hash(password, 10);
  
          const query = 'INSERT INTO users (Username, EMAIL, Password, phone, Date_of_Birth, role) VALUES (?, ?, ?, ?, ?, ?)'; // Added role
          await db.query(query, [username, email, hashedPassword, phone, dob, 'user']); // Set role to 'user'
  
          res.redirect('/login');
      } catch (error) {
          console.error('Signup error:', error);
          res.render('signup', { error: 'An error occurred during signup' });
      }
  },

    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.error('Logout error:', err);
            }
            res.redirect('/login');
        });
    },
};

module.exports = authController;