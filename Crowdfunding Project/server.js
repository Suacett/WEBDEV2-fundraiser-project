/**
 * server.js
 * 
 * This is the backend server for the Crowdfunding Platform.
 * It uses Express to handle api requests and my SQL for the database.
 */

// Module import
const express = require('express');       // Express framework
const mysql = require('mysql2');         // MySQL client
const cors = require('cors');             // Cors Middleware
const app = express();                    // Initialise Express app
const port = process.env.PORT || 3000;    // The port that the server runs on

// Middleware 

app.use(cors());                            // Enable CORS
app.use(express.json());                    // Parse incoming json requests
app.use(express.urlencoded({ extended: false })); // Parse url encoded data
app.use(express.static('public'));          // Static files from the public directory

// Database Connection Setup

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',       // Database host
    user: process.env.DB_USER || 'root',            // Database user
    password: process.env.DB_PASSWORD || 'FAKEPASSWORD', // Database password
    database: process.env.DB_NAME || 'crowdfunding_db'  // Database name
});

// Connect to the MySQL database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err); // Log connection errors
        return;
    }
    console.log('Connected to the crowdfunding_db database.'); // Confirm successful connection
});

// API

/**
 * get fundraisers api
 * 
 * Retrieves all active fundraisers from the database.
 * Joins the fundraiser table with the category table to get category names.
 */
app.get('/api/fundraisers', (req, res) => {
    // SQL query to select active fundraisers with their category names
    const query = `
        SELECT f.*, c.NAME AS CATEGORY_NAME 
        FROM FUNDRAISER f 
        JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID 
        WHERE f.ACTIVE = TRUE
    `;

    // Execute the SQL query
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching fundraisers:', err); // Log query errors
            return res.status(500).json({ error: 'Error fetching fundraisers' }); // Send error response
        }
        res.json(results); // Send the retrieved fundraisers as json
    });
});

/**
 * get categories api
 * 
 * Retrieves all categories from the category table.
 */
app.get('/api/categories', (req, res) => {
    // SQL query to select all categories
    const query = 'SELECT * FROM CATEGORY';

    // Execute the SQL query
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching categories:', err); // Log query errors
            return res.status(500).json({ error: 'Error fetching categories' }); // Send error response
        }
        res.json(results); // Send the retrieved categories as json
    });
});

/**
 * get search api
 * 
 * Searches for active fundraisers based on provided criteria.
 * Accepts query parameters: organizer, city, category
 */
app.get('/api/search', (req, res) => {
    // SQL query to select active fundraisers with their category names
    let query = `
        SELECT f.*, c.NAME AS CATEGORY_NAME 
        FROM FUNDRAISER f 
        JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID 
        WHERE f.ACTIVE = TRUE
    `;

    const conditions = []; // Array to hold SQL conditions
    const params = [];     // Array to hold parameter values for prepared statements

    // Organise query parameters from the request
    const { organizer, city, category } = req.query;

    // Add conditions based on the query parameters
    if (organizer) {
        conditions.push('f.ORGANIZER LIKE ?');      // Search for organisers containing the input string
        params.push(`%${organizer}%`);              // Wildcard search parameter
    }
    if (city) {
        conditions.push('f.CITY LIKE ?');           // Search for cities containing the input string
        params.push(`%${city}%`);
    }
    if (category) {
        conditions.push('c.NAME = ?');              // Search for exact category matches
        params.push(category);
    }

    // If any conditions were added, add them to the SQL query
    if (conditions.length > 0) {
        query += ' AND ' + conditions.join(' AND '); // Combine conditions with operators
    }

    // Execute the SQL query with the provided parameters
    connection.query(query, params, (err, results) => {
        if (err) {
            console.error('Error searching fundraisers:', err); // Log errors
            return res.status(500).json({ error: 'Error searching fundraisers' }); // Send error response
        }
        res.json(results); // Send the search results as json
    });
});

/**
 * get fundraiser by id api 
 * 
 * Retrieves the details of a single fundraiser based on the provided ID
 */
app.get('/api/fundraiser/:id', (req, res) => {
    const { id } = req.params; // Extract the fundraiser ID from the route parameters

    // SQL query to select a specific fundraiser with its category name
    const query = `
        SELECT f.*, c.NAME AS CATEGORY_NAME 
        FROM FUNDRAISER f 
        JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID 
        WHERE f.FUNDRAISER_ID = ?
    `;

    // Execute the SQL query with the provided ID
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching fundraiser:', err); // Log errors
            return res.status(500).json({ error: 'Error fetching fundraiser' }); // Send error response
        }
        if (results.length === 0) {
            // If no fundraiser is found with the given id, send a 404 response
            return res.status(404).json({ error: 'Fundraiser not found' });
        }
        res.json(results[0]); // Send the first and only fundraiser as json 
    });
});

/**
 * Start the Express server and listen on the specified port.
 */
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`); // Log a message when the server starts
});
