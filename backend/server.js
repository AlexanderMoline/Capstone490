import express from 'express';
import db from './db.js'; 

const app = express();
const port = 3000;

// Add HTTP headers to allow backend and frontend to communicate
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get("/home", (req, res) => {
    res.send("Server is ready");
});

app.get("/test", async (req, res) => {
    try {
        const result = await db.query(
            `SELECT * FROM public.mp_circumstances_physical WHERE hair_color = $1`,
            ['Brown']
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Database query failed" });
    }
});

//Route for missing_persons (filter and sort)
app.get("/mp/search", async (req, res) => {
    try {
        const { 
            state, county, city, biological_sex, missing_age, race_ethnicity, 
            height_min, height_max, weight, eye_color, hair_color, sortBy, sortOrder 
        } = req.query;

        let query = `
            SELECT mp.*, mcp.* 
            FROM missing_persons mp
            LEFT JOIN mp_circumstances_physical mcp 
            ON mp.case_number = mcp.case_number
            WHERE 1=1
        `;
        const params = [];

        if (state) {
            query += ` AND mp.state = $${params.length + 1}`;
            params.push(state);
        }
        if (county) {
            query += ` AND mp.county = $${params.length + 1}`;
            params.push(county);
        }
        if (city) {
            query += ` AND mp.city = $${params.length + 1}`;
            params.push(city);
        }
        if (biological_sex) {
            query += ` AND mp.biological_sex = $${params.length + 1}`;
            params.push(biological_sex);
        }
        if (missing_age) {
            query += ` AND mp.missing_age = $${params.length + 1}`;
            params.push(missing_age);
        }
        if (race_ethnicity) {
            query += ` AND mp.race_or_ethnicity = $${params.length + 1}`;
            params.push(race_ethnicity);
        }

        if (height_min && height_max) {
            query += ` AND mcp.height BETWEEN $${params.length + 1} AND $${params.length + 2}`;
            params.push(height_min, height_max);
        } else if (height_min) {
            query += ` AND mcp.height >= $${params.length + 1}`;
            params.push(height_min);
        } else if (height_max) {
            query += ` AND mcp.height <= $${params.length + 1}`;
            params.push(height_max);
        }

        if (weight) {
            query += ` AND mcp.weight = $${params.length + 1}`;
            params.push(weight);
        }

        if (eye_color) {
            query += ` AND (mcp.left_eye_color = $${params.length + 1} OR mcp.right_eye_color = $${params.length + 1})`;
            params.push(eye_color);
        }

        if (hair_color) {
            query += ` AND mcp.hair_color = $${params.length + 1}`;
            params.push(hair_color);
        }

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

/*
//Route for unidentified_persons (filter and sort)
app.get("/up/search", async (req, res) => {
    try {
        const { 
            state, county, city, biological_sex, missing_age, age_from, age_to, 
            race_ethnicity, height_min, height_max, weight, eye_color, hair_color, sortBy, sortOrder 
        } = req.query;

        // Build the query dynamically
        let query = `
            SELECT up.*, ucp.* 
            FROM unidentified_persons up
            LEFT JOIN up_circumstances_physical ucp 
            ON up.namus_number = ucp.namus_number
            WHERE 1=1
        `;
        const params = [];

        if (state) {
            query += ` AND up.state = $${params.length + 1}`;
            params.push(state);
        }
        if (county) {
            query += ` AND up.county = $${params.length + 1}`;
            params.push(county);
        }
        if (city) {
            query += ` AND up.city = $${params.length + 1}`;
            params.push(city);
        }
        if (biological_sex) {
            query += ` AND up.biological_sex = $${params.length + 1}`;
            params.push(biological_sex);
        }
        if (missing_age) {
            query += ` AND up.missing_age = $${params.length + 1}`;
            params.push(missing_age);
        }
        
        // Age range filter
        if (age_from && age_to) {
            query += ` AND up.missing_age BETWEEN $${params.length + 1} AND $${params.length + 2}`;
            params.push(age_from, age_to);
        } else if (age_from) {
            query += ` AND up.missing_age >= $${params.length + 1}`;
            params.push(age_from);
        } else if (age_to) {
            query += ` AND up.missing_age <= $${params.length + 1}`;
            params.push(age_to);
        }

        if (race_ethnicity) {
            query += ` AND up.race_ethnicity = $${params.length + 1}`;
            params.push(race_ethnicity);
        }

        // Height filter (CAST height_certainty to integer safely)
        if (height_min && height_max) {
            query += ` AND (
                ucp.height_from BETWEEN $${params.length + 1} AND $${params.length + 2} 
                OR (
                    ucp.height_certainty ~ '^[0-9]+$' -- Ensure it's numeric before casting
                    AND (ucp.height_from + CAST(ucp.height_certainty AS INTEGER)) BETWEEN $${params.length + 1} AND $${params.length + 2}
                )
            )`;
            params.push(height_min, height_max);
        } else if (height_min) {
            query += ` AND (
                ucp.height_from >= $${params.length + 1} 
                OR (
                    ucp.height_certainty ~ '^[0-9]+$'
                    AND (ucp.height_from + CAST(ucp.height_certainty AS INTEGER)) >= $${params.length + 1}
                )
            )`;
            params.push(height_min);
        } else if (height_max) {
            query += ` AND (
                ucp.height_from <= $${params.length + 1} 
                OR (
                    ucp.height_certainty ~ '^[0-9]+$'
                    AND (ucp.height_from + CAST(ucp.height_certainty AS INTEGER)) <= $${params.length + 1}
                )
            )`;
            params.push(height_max);
        }

        // Weight filter (CAST weight_certainty to integer safely)
        if (weight) {
            query += ` AND (
                ucp.weight_certainty ~ '^[0-9]+$' 
                AND ABS(CAST(ucp.weight_certainty AS INTEGER) - $${params.length + 1}) <= 5
            )`;
            params.push(weight);
        }

        // Eye color filter (matches either left or right eye)
        if (eye_color) {
            query += ` AND (ucp.left_eye_color = $${params.length + 1} OR ucp.right_eye_color = $${params.length + 1})`;
            params.push(eye_color);
        }

        // Hair color filter
        if (hair_color) {
            query += ` AND ucp.hair_color = $${params.length + 1}`;
            params.push(hair_color);
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
                query += ` AND age_from >= $${params.length + 1}`;
                params.push(age_from);
            }
            if (age_to) {
                query += ` AND age_to <= $${params.length + 1}`;
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
*/

//Route for specific missing_persons 
app.get('/mp/:case_number', async (req, res) => {
    const { case_number } = req.params;
    try {
        const result = await db.query(
            `SELECT mp.*, mcp.*, ma.*, mi.* 
             FROM public.missing_persons mp
             LEFT JOIN public.mp_circumstances_physical mcp 
             ON mp.case_number = mcp.case_number
             LEFT JOIN public.mp_articles ma
             ON mp.case_number = ma.case_number
             LEFT JOIN public.mp_images mi
             ON mp.case_number = mi.case_number
             WHERE mp.case_number = $1`, 
            [case_number]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Case not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Failed to fetch case details' });
    }
});

//Route for specific unidentified_persons 
app.get('/up/:namus_number', async (req, res) => {
    const { namus_number } = req.params;
    try {
        const result = await db.query(
            `SELECT up.*, ucp.*, ua.*, ui.* 
             FROM public.unidentified_persons up
             LEFT JOIN public.up_circumstances_physical ucp 
             ON up.namus_number = ucp.namus_number
             LEFT JOIN public.up_articles ua
             ON up.namus_number = ua.namus_number
             LEFT JOIN public.up_images ui
             ON up.namus_number = ui.namus_number
             WHERE up.namus_number = $1`, 
            [namus_number]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Case not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Failed to fetch case details' });
    }
});


// Start the server at /home
app.listen(port, () => {
    console.log(`✅ Server started at http://localhost:${port}/home`);
});
