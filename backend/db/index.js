const mysql = require('mysql2/promise');  // Use the promise version of mysql2
require('dotenv').config(); // ✅ Always good to load env here too

// Create a pool of connections instead of a single connection for better performance
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function connectDB() {
  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database');
    connection.release(); // Release the connection back to the pool
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
    process.exit(1); // Optional: exit on DB fail
  }
}

connectDB();

module.exports = pool;  // Export the pool, not the connection
