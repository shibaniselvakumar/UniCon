const express = require('express');
const router = express.Router();
const db = require('../db');

// Simple login route
router.post('/login', (req, res) => {
  const { email } = req.body;

  const sql = 'SELECT * FROM Student WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Login successful', student: results[0] });
  });
});

module.exports = router;
