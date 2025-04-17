const mysql = require('mysql2');
require('dotenv').config(); // ✅ Always good to load env here too

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.message);
    process.exit(1); // Optional: exit on DB fail
  } else {
    console.log('✅ Connected to MySQL database');
  }
});

module.exports = db;
