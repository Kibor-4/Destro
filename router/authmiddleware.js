const getPool = require('../database/db'); // Import getPool

const isAuthenticated = (req, res, next) => {
    console.log('Session in isAuthenticated:', req.session);

    if (req.session && req.session.userId) {
        // Fetch user from database and attach to req.user here.
        getPool.then(pool => pool.query('SELECT * FROM Users where id = ?', [req.session.userId]))
            .then(([rows]) => {
                if (rows && rows.length > 0) {
                    req.user = rows[0];
                    return next();
                } else {
                    console.log("user not found from session id");
                    // Store the intended URL before redirecting
                    req.session.redirectTo = req.originalUrl;
                    return res.redirect("/login");
                }
            })
            .catch(err => {
                console.log("error fetching user from database");
                // Store the intended URL before redirecting
                req.session.redirectTo = req.originalUrl;
                return res.redirect("/login");
            });
    } else {
        console.log('User not authenticated');
        // Store the intended URL before redirecting
        req.session.redirectTo = req.originalUrl;
        res.redirect('/login');
    }
};

module.exports = isAuthenticated;