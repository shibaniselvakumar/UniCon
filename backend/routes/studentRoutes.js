const express = require('express');
const router = express.Router();
const db = require('../db');

// Add new student (uses stored procedure)
router.post('/register', async (req, res) => {
  const { name, email, college, year } = req.body;

  const sql = 'CALL RegisterStudent(?, ?, ?, ?)';

  try {
    const [result] = await db.query(sql, [name, email, college, year]);
    const studentId = result[0][0].student_id;
    res.status(200).json({ message: 'Student registered successfully', studentId });
  } catch (err) {
    console.error('Error calling procedure:', err);
    return res.status(500).json({ message: 'Error adding student' });
  }
});

// Get all students
router.get('/', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM Student');
    res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ message: 'Error retrieving students' });
  }
});

// Get student by ID
router.get('/:id', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM Student WHERE student_id = ?', [req.params.id]);
    res.status(200).json(results[0]);
  } catch (err) {
    return res.status(500).json({ message: 'Error retrieving student' });
  }
});

// Update student
router.put('/:id', async (req, res) => {
  const { name, email, college, year } = req.body;
  const sql = 'UPDATE Student SET name = ?, email = ?, college = ?, year = ? WHERE student_id = ?';

  try {
    await db.query(sql, [name, email, college, year, req.params.id]);
    res.status(200).json({ message: 'Student updated successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Error updating student' });
  }
});

// Delete student (trigger will log this)
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM Student WHERE student_id = ?', [req.params.id]);
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Error deleting student' });
  }
});
// in studentRoutes.js
router.post('/names', async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'Invalid ID list' });
  }

  try {
    const placeholders = ids.map(() => '?').join(',');
    const [rows] = await db.execute(
      `SELECT student_id, name FROM student WHERE student_id IN (${placeholders})`,
      ids
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching names' });
  }
});


module.exports = router;
