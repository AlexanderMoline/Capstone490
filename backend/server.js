import express from 'express';
import db from './db.js';  // ✅ Correct relative import

const app = express();
const port = 3000;

// Root route - Basic server check
app.get("/", (req, res) => {
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


// Start the server
app.listen(port, () => {
    console.log(`✅ Server started at http://localhost:${port}`);
});
