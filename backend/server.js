import express from 'express';
import db from './db.js';  // ✅ Correct relative import

const app = express();
const port = 3000;

// Root route - Basic server check
app.get("/home", (req, res) => {
    res.send("Server is ready");
});

// Test database connection with a simple query
app.get("/test", async (req, res) => {
    try {
        const result = await db.query(
            `SELECT * FROM public.missing_persons WHERE state = $1 ORDER BY case_number ASC LIMIT 100`, 
            ['AR']
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Database query failed" });
    }
});

app.get("/mp", async (req, res) => {
    try {
        const { state, county, city, biological_sex, missing_age, race_ethnicity, sortBy, sortOrder } = req.query;

        // Build the query dynamically
        let query = 'SELECT * FROM missing_persons WHERE 1=1';
        const params = [];

        if (state) {
            query += ' AND state = $1';
            params.push(state);
        }
        if (county) {
            query += ` AND county = $${params.length + 1}`;
            params.push(county);
        }
        if (city) {
            query += ` AND city = $${params.length + 1}`;
            params.push(city);
        }
        if (biological_sex) {
            query += ` AND biological_sex = $${params.length + 1}`;
            params.push(biological_sex);
        }
        if (missing_age) {
            query += ` AND missing_age = $${params.length + 1}`;
            params.push(missing_age);
        }
        if (race_ethnicity) {
            query += ` AND race_ethnicity = $${params.length + 1}`;
            params.push(race_ethnicity);
        }

        // Handle sorting
        if (sortBy) {
            const order = sortOrder === 'desc' ? 'DESC' : 'ASC';
            query += ` ORDER BY ${sortBy} ${order}`;
        }

        // Execute the query
        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});


app.get('/mp/:case_number', async (req, res) => {
    const { case_number } = req.params;
    try {
        const result = await db.query('SELECT * FROM public.missing_persons WHERE case_number = $1', [case_number]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Case not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch case details' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`✅ Server started at http://localhost:${port}`);
});
