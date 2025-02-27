const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const path = require('path');
const cors = require('cors');
const getPool = require('./database/db');
const routes = require('./router/routes');
const userRoutes = require('./router/signup');
const loginRouter = require('./router/auth');
const addPropertyRouter = require('./router/addproperty');
const saleRouter = require('./router/salerouter');
const authadmin = require('./router/authadmin');
const admindash = require('./router/user_dash');
const profile = require('./router/user');
const fs = require('fs'); 
const propertydetails = require('./router/property');
const userdashboard = require('./router/user_dash');
const home = require('./router/index');
const valuate = require('./router/valuate');

const app = express();

// Load environment variables from .env file
require('dotenv').config();

// Logging middleware (ADDED)
app.use((req, res, next) => {
    const now = new Date().toISOString();
    const logMessage = `${now} - ${req.method} ${req.url} - Session ID: ${req.sessionID || 'No Session'}\n`;

    fs.appendFile('server.log', logMessage, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });

    console.log(logMessage.trim()); // Also log to console
    next();
});

// CORS configuration (if needed)
app.use(cors());

// ... (Rest of your code remains the same) ...

// MySQL session store configuration
const sessionStore = new MySQLStore({
    host: process.env.DB_HOST, // Use DB_HOST from .env
    port: 3306, // Default MySQL port
    user: process.env.DB_USER, // Use DB_USER from .env
    password: process.env.DB_PASSWORD, // Use DB_PASSWORD from .env
    database: process.env.DB_NAME, // Use DB_NAME from .env
    createDatabaseTable: true, // Automatically create the sessions table
    schema: {
        tableName: 'user_sessions', // Name of the sessions table
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
});

// Session middleware
app.use(session({
    store: sessionStore,
    secret: 'your_secret_key', // Replace with a strong, random secret
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        sameSite: 'lax' // Ensure the cookie is sent with cross-site requests
    }
}));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use('/Public', express.static(path.join(__dirname, 'Public')));

// Mount routes
app.use('/', routes);
app.use('/', userRoutes); // Signup routes
app.use('/login', loginRouter); // Login routes
app.use('/', addPropertyRouter); // Add property routes
app.use('/', saleRouter); // Sale routes
app.use('/admin/login', authadmin);
app.use('/', admindash); // Mount admin routes at /admin
app.use('/', profile); // Mount user profile routes directly at root
app.use('/',propertydetails);
app.use('/',userdashboard);
app.use('/',home);
app.use('/',valuate);

// Logout route
app.get('/logout', (req, res) => {
    console.log('Session before destruction:', req.session);
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Logout failed');
        }
        console.log('Session destroyed successfully');
        res.redirect('/login');
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error stack:', err.stack);
    res.status(500).send('Something went wrong!');
});

// Start server
async function startServer() {
    try {
        const pool = await getPool;
        console.log('Database connected successfully');

        const port = process.env.PORT || 8100; // Use PORT from .env
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (err) {
        console.error("Failed to connect to database:", err);
        process.exit(1);
    }
}

startServer();