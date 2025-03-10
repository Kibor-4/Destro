// database/db.js
require('dotenv').config();
const mysql = require('mysql2/promise');

let pool;

async function createTables(pool) {
    const conn = await pool.getConnection();
    try {
        await conn.execute(`
            CREATE TABLE IF NOT EXISTS Users (
                Id INT AUTO_INCREMENT PRIMARY KEY,
                Username VARCHAR(255) NOT NULL UNIQUE,
                EMAIL VARCHAR(255) NOT NULL UNIQUE,
                Date_of_Birth DATE,
                Password VARCHAR(255) NOT NULL,
                profile_picture VARCHAR(255),
                name VARCHAR(255),
                phone VARCHAR(255)
            )
        `);
        console.log('Users table created or verified.');

        await conn.execute(`
            CREATE TABLE IF NOT EXISTS Properties (
                id INT AUTO_INCREMENT PRIMARY KEY,
                location VARCHAR(255) NOT NULL,
                house_type VARCHAR(50) NOT NULL,
                sqft INT NOT NULL,
                bedrooms INT NOT NULL,
                bathrooms INT NOT NULL,
                lot_size INT,
                price DECIMAL(10, 2) NOT NULL,
                description TEXT,
                images TEXT,
                user_id INT,
                FOREIGN KEY (user_id) REFERENCES Users(Id)
            )
        `);
        console.log('Properties table created or verified.');

        await conn.execute(`
            CREATE TABLE IF NOT EXISTS user_sessions (
                session_id VARCHAR(128) NOT NULL PRIMARY KEY,
                expires BIGINT NOT NULL,
                data TEXT
            )
        `);
        console.log('Express session table created successfully.');

        const [columns] = await conn.execute(`SHOW COLUMNS FROM Properties LIKE 'created_at'`);
        if (columns.length === 0) {
            await conn.execute(`
                ALTER TABLE Properties
                ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            `);
            console.log('Properties table created_at column added.');
        } else {
            console.log('Properties table created_at column already exists.');
        }
    } finally {
        conn.release();
    }
}

async function connectToDatabase() {
    try {
        if (!pool) {
            pool = mysql.createPool({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                connectionLimit: 10,
                waitForConnections: true,
                queueLimit: 0,
                connectTimeout: 20000,
            });

            console.log('Database pool created successfully');

            const conn = await pool.getConnection();
            try {
                await conn.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
                console.log(`Database ${process.env.DB_NAME} created or verified.`);
            } finally {
                conn.release();
            }

            await createTables(pool);
        }
        return pool;
    } catch (err) {
        console.error('Database connection or creation error:', err);
        throw new Error(`Failed to connect to database: ${err.message}`);
    }
}

module.exports = connectToDatabase(); // Export the promise of the pool