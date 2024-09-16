// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Database connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'FAKEPASSWORD',
    database: process.env.DB_NAME || 'crowdfunding_db'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to the crowdfunding_db database.');
});

// API

// Get all active fundraisers
app.get('/api/fundraisers', (req, res) => {
    const query = `
        SELECT f.*, c.NAME AS CATEGORY_NAME 
        FROM FUNDRAISER f 
        JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID 
        WHERE f.ACTIVE = TRUE
    `;
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching fundraisers:', err);
            return res.status(500).json({ error: 'Error fetching fundraisers' });
        }
        res.json(results);
    });
});

// Get all Categories
app.get('/api/categories', (req, res) => {
    const query = 'SELECT * FROM CATEGORY';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching categories:', err);
            return res.status(500).json({ error: 'Error fetching categories' });
        }
        res.json(results);
    });
});

// Search active fundraisers
app.get('/api/search', (req, res) => {
    let query = `
        SELECT f.*, c.NAME AS CATEGORY_NAME 
        FROM FUNDRAISER f 
        JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID 
        WHERE f.ACTIVE = TRUE
    `;
    const conditions = [];
    const params = [];

    const { organizer, city, category } = req.query;

    if (organizer) {
        conditions.push('f.ORGANIZER LIKE ?');
        params.push(`%${organizer}%`);
    }
    if (city) {
        conditions.push('f.CITY LIKE ?');
        params.push(`%${city}%`);
    }
    if (category) {
        conditions.push('c.NAME = ?');
        params.push(category);
    }

    if (conditions.length > 0) {
        query += ' AND ' + conditions.join(' AND ');
    }

    connection.query(query, params, (err, results) => {
        if (err) {
            console.error('Error searching fundraisers:', err);
            return res.status(500).json({ error: 'Error searching fundraisers' });
        }
        res.json(results);
    });
});

// Get fundraiser details by ID
app.get('/api/fundraiser/:id', (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT f.*, c.NAME AS CATEGORY_NAME 
        FROM FUNDRAISER f 
        JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID 
        WHERE f.FUNDRAISER_ID = ?
    `;
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching fundraiser:', err);
            return res.status(500).json({ error: 'Error fetching fundraiser' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Fundraiser not found' });
        }
        res.json(results[0]);
    });
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});