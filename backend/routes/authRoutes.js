const express = require('express');
const router = express.Router();
const db = require('../db');

// Simple login route
router.post('/login', async (req, res) => {
  const { email } = req.body;

  const sql = 'SELECT * FROM Student WHERE email = ?';

  try {
    const [results] = await db.query(sql, [email]);
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Login successful', user: results[0] });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
