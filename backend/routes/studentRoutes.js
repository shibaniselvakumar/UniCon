// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Add new student (uses stored procedure)
router.post('/register', (req, res) => {
  const { name, email, college, year } = req.body;

  const sql = 'CALL RegisterStudent(?, ?, ?, ?)';
  db.query(sql, [name, email, college, year], (err, result) => {
    if (err) {
      console.error('Error calling procedure:', err);
      return res.status(500).json({ message: 'Error adding student' });
    }
    const studentId = result[0][0].student_id;
    res.status(200).json({ message: 'Student registered successfully', studentId });
  });
});

// Get all students
router.get('/', (req, res) => {
  db.query('SELECT * FROM Student', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error retrieving students' });
    }
    res.status(200).json(results);
  });
});

// Get student by ID
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM Student WHERE student_id = ?', [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error retrieving student' });
    }
    res.status(200).json(results[0]);
  });
});

// Update student
router.put('/:id', (req, res) => {
  const { name, email, college, year } = req.body;
  const sql = 'UPDATE Student SET name = ?, email = ?, college = ?, year = ? WHERE student_id = ?';
  db.query(sql, [name, email, college, year, req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating student' });
    }
    res.status(200).json({ message: 'Student updated successfully' });
  });
});

// Delete student (trigger will log this)
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM Student WHERE student_id = ?', [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting student' });
    }
    res.status(200).json({ message: 'Student deleted successfully' });
  });
});

module.exports = router;
