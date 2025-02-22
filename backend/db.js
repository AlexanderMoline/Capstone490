import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false // Use true if you have a valid certificate
  }
});

// Test the database connection
pool.connect()
  .then(() => console.log("✅ Connected to the database successfully!"))
  .catch((err) => console.error("❌ Database connection error:", err.stack));

export default {
  query: (text, params) => pool.query(text, params),
};
