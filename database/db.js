const mysql = require('mysql2');
const express = require('express');


const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'knls123'
});

conn.connect((err) => {
    if (err) {
        console.log(`Database connection failed: ${err.stack}`);
        return;
    }
    console.log('Database connected successfully');

    // Create the database
    conn.query('CREATE DATABASE IF NOT EXISTS db4', (err, result) => {
        if (err) {
            console.log('Error creating database: ', err);
        } else {
            console.log('Database "db4" created or already exists');
        }

        // Use the created database
        conn.query('USE db4', (err) => {
            if (err) {
                console.log('Error using database: ', err);
            } else {
                console.log('Using database "db4"');

                // Create the "Users" table
                conn.query('CREATE TABLE IF NOT EXISTS Users (' +
                    'Id INT AUTO_INCREMENT PRIMARY KEY,' +
                    'Username VARCHAR(255),'+
                    'EMAIL VARCHAR(255),' + 
                    'Date_of_Birth DATE,' +
                    'Password VARCHAR(255)' +
                    ')', (err, result) => {
                        if (err) {
                            console.log('Error creating table: ', err);
                        } else {
                            console.log('Table "Users" created or already exists');
                        }
                    });
            }
        });
    });
});

module.exports = conn;