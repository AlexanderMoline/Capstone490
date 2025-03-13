import express from 'express';
import db from './db.js'; 

const app = express();
const port = 3000;

// Root route to homepage
app.get("/home", (req, res) => {
    res.send("Server is ready");
});

//Database Tester
app.get("/test", async (req, res) => {
    try {
        const result = await db.query(
            `SELECT * FROM public.unidentified_persons WHERE state = $1 ORDER BY case_number ASC LIMIT 100`, 
            ['TX']
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Database query failed" });
    }
});

//Routes For missing_persons (filter and sort)
app.get("/mp/search", async (req, res) => {
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

//Route for unidentified_persons (filter and sort)
app.get("/up/search", async (req, res) => {
    try {
        const { state, county, city, biological_sex, missing_age, age_from, age_to, race_ethnicity, sortBy, sortOrder } = req.query;

        // Build the query dynamically
        let query = 'SELECT * FROM unidentified_persons WHERE 1=1';
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
        if (age_from) {
            query += ` AND age_from = $${params.length + 1}`;
            params.push(age_from);
        }
        if (age_to) {
            query += ` AND missing_age = $${params.length + 1}`;
            params.push(age_to);
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
        

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

//Route to search both databases
app.get("/persons/search", async (req, res) => {
    try {
        const { state, county, city, biological_sex, missing_age, race_ethnicity, sortBy, sortOrder, age_from, age_to } = req.query;

        // Helper function to build query
        const buildQuery = (tableName) => {
            let query = `SELECT * FROM ${tableName} WHERE 1=1`;
            const params = [];
            
            if (state) {
                query += ` AND state = $${params.length + 1}`;
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
            if (age_from) {
                query += ` AND missing_age >= $${params.length + 1}`;
                params.push(age_from);
            }
            if (age_to) {
                query += ` AND missing_age <= $${params.length + 1}`;
                params.push(age_to);
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

            return { query, params };
        };

        // Build queries for both tables
        const missingQuery = buildQuery('missing_persons');
        const unidentifiedQuery = buildQuery('unidentified_persons');

        // Execute both queries in parallel
        const [missingResult, unidentifiedResult] = await Promise.all([
            db.query(missingQuery.query, missingQuery.params),
            db.query(unidentifiedQuery.query, unidentifiedQuery.params)
        ]);

        // Return separate results
        res.json({
            missing_persons: missingResult.rows,
            unidentified_persons: unidentifiedResult.rows
        });

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});


//Route for specific missing_persons 
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

//Route for specific unidentified_persons 
app.get('/up/:case_number', async (req, res) => {
    const { case_number } = req.params;
    try {
        const result = await db.query('SELECT * FROM public.unidentified_persons WHERE case_number = $1', [case_number]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Case not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch case details' });
    }
});

// Start the server at /home
app.listen(port, () => {
    console.log(`✅ Server started at http://localhost:${port}/home`);
});
