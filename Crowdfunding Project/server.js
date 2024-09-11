const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'FAKEPASSWORD',
    database: 'crowdfunding_db'
});

connection.connect((err) => {
    if (err) {
        console.log('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
});

// get all active fundraisers including the category
app.get('/api/fundraisers', (req, res) => {
    let query = `
        SELECT f.*, c.NAME as CATEGORY_NAME 
        FROM FUNDRAISER f 
        JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID 
        WHERE f.ACTIVE = TRUE
    `;
    connection.query(query, (err, results) => {
        if (err) {
            console.log(err);
            res.json({ error: 'Error fetching fundraisers' });
        } else {
            res.json(results);
        }
    });
});

// get all categories
app.get('/api/categories', (req, res) => {
    let query = 'SELECT * FROM CATEGORY';
    connection.query(query, (err, results) => {
        if (err) {
            console.log(err);
            res.json({ error: 'Error fetching categories' });
        } else {
            res.json(results);
        }
    });
});

// get active fundraisers by criteria
app.get('/api/search', (req, res) => {
    let query = `
        SELECT f.*, c.NAME as CATEGORY_NAME 
        FROM FUNDRAISER f 
        JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID 
        WHERE f.ACTIVE = TRUE
    `;
    let conditions = [];
    let params = [];
    
    if (req.query.organizer) {
        conditions.push('f.ORGANIZER LIKE ?');
        params.push(`%${req.query.organizer}%`);
    }
    if (req.query.city) {
        conditions.push('f.CITY LIKE ?');
        params.push(`%${req.query.city}%`);
    }
    if (req.query.category) {
        conditions.push('c.NAME LIKE ?');
        params.push(`%${req.query.category}%`);
    }

    if (conditions.length > 0) {
        query += ' AND ' + conditions.join(' AND ');
    }

    connection.query(query, params, (err, results) => {
        if (err) {
            console.log(err);
            res.json({ error: 'Error searching fundraisers' });
        } else {
            res.json(results);
        }
    });
});

// get fundraiser by ID
app.get('/api/fundraiser/:id', (req, res) => {
    let query = `
        SELECT f.*, c.NAME as CATEGORY_NAME 
        FROM FUNDRAISER f 
        JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID 
        WHERE f.FUNDRAISER_ID = ?
    `;
    connection.query(query, [req.params.id], (err, results) => {
        if (err) {
            console.log(err);
            res.json({ error: 'Error fetching fundraiser' });
        } else if (results.length === 0) {
            res.json({ error: 'Fundraiser not found' });
        } else {
            res.json(results[0]);
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});