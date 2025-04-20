const express = require('express');
const router = express.Router();
const pool = require('../db');  // Import the pool from db/index.js

// POST: Create a new project
router.post('/create', async (req, res) => {
  const { title, description, teammates } = req.body;

  // Validate input
  if (!title || !description || !teammates || teammates.length === 0) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  const query = 'INSERT INTO Projects (title, description) VALUES (?, ?)';

  try {
    // Insert project
    const [result] = await pool.query(query, [title, description]);
    const projectId = result.insertId;

    // Insert roles with total and available teammates
    const rolePromises = teammates.map((teammate) => {
      const roleQuery = `
        INSERT INTO Roles (project_id, role_name, num_teammates, num_teammates_total)
        VALUES (?, ?, ?, ?)`;
      return pool.query(roleQuery, [
        projectId,
        teammate.role_name,
        teammate.num_teammates,
        teammate.num_teammates, // Same as total at creation
      ]);
    });

    await Promise.all(rolePromises);

    res.status(201).json({ message: 'Project created successfully', projectId });
  } catch (err) {
    console.error('Error creating project or adding roles:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
