const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const path = require('path');
const cors = require('cors');
const getPool = require('./database/db');
const userRoutes = require('./router/UserRoutes/signup');
const loginRouter = require('./router/AuthRoutes/auth');
const addPropertyRouter = require('./router/UserRoutes/addproperty');
const saleRouter = require('./router/UserRoutes/salerouter');
const profile = require('./router/UserRoutes/user');
const propertydetails = require('./router/UserRoutes/property');
const userdashboard = require('./router/UserRoutes/dash');
const home = require('./router/UserRoutes/index');
const valuate = require('./router/UserRoutes/valuate');
const auth = require('./router/AuthRoutes/auth');
const adminRoutes = require('./router/AdminRoutes/dashboard'); // Import admin routes
const propertyRoutes = require('./router/AdminRoutes/properties'); // Import property routes
const analyticsRoutes = require('./router/AdminRoutes/analytics'); // Import analytics routes
const settingsRoutes = require('./router/AdminRoutes/settings'); // Import settings routes
const transactionRoutes = require('./router/AdminRoutes/transaction'); // Import transaction routes
const about = require('./router/UserRoutes/routes')

const fs = require('fs');

const app = express();

require('dotenv').config();

app.use((req, res, next) => {
    const now = new Date().toISOString();
    const logMessage = `${now} - ${req.method} ${req.url} - Session ID: ${req.sessionID || 'No Session'}\n`;

    fs.appendFile('server.log', logMessage, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });

    console.log(logMessage.trim());
    next();
});

app.use(cors());

const sessionStore = new MySQLStore({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    createDatabaseTable: true,
    schema: {
        tableName: 'user_sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
});

app.use(session({
    store: sessionStore,
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: 'lax'
    }
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', [
    path.join(__dirname, 'views/user'),
    path.join(__dirname, 'views/admin'),
    path.join(__dirname, 'Views/Shared'),
    path.join(__dirname, 'views')
]);

app.use('/Public', express.static(path.join(__dirname, 'Public')));

app.use('/', userRoutes);
app.use('/', loginRouter);
app.use('/', addPropertyRouter);
app.use('/', saleRouter);
app.use('/', profile);
app.use('/', propertydetails);
app.use('/', userdashboard);
app.use('/', home);
app.use('/', valuate);
app.use('/', auth);
app.use('/', adminRoutes); // Mount admin routes
app.use('/', propertyRoutes); // Mount property routes
app.use('/', analyticsRoutes); // Mount analytics routes
app.use('/', settingsRoutes); // Mount settings routes
app.use('/', transactionRoutes); // Mount transaction routes
app.use('/',about);

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

app.use((err, req, res, next) => {
    console.error('Error stack:', err.stack);
    res.status(500).send('Something went wrong!');
});

async function startServer() {
    try {
        const pool = await getPool;
        console.log('Database connected successfully');

        const port = process.env.PORT || 8100;
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (err) {
        console.error("Failed to connect to database:", err);
        process.exit(1);
    }
}

startServer();