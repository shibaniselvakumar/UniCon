const express = require('express');
const router = express.Router();
const db = require('../db');

// Post Message
router.post('/:roomId/postMessage', async (req, res) => {
  const { roomId } = req.params;
  const { user_id, message } = req.body;

  if (!message || !user_id) {
    return res.status(400).json({ error: 'Message and user ID are required' });
  }

  try {
    // Insert the message into the database
    await db.query('INSERT INTO room_messages (room_id, user_id, message, created_at) VALUES (?, ?, ?, NOW())', [roomId, user_id, message]);
    res.status(201).json({ message: 'Message posted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to post message' });
  }
});

// Add/Update/Delete To-Do List Item
router.post('/:roomId/updateTodo', async (req, res) => {
  console.log('BODY:', req.body);
  console.log('PARAMS:', req.params);
  const { roomId } = req.params;


  const { action, task_id, task_description, user_id } = req.body;

  if (!action || !user_id) {
    return res.status(400).json({ error: 'Missing action or user_id' });
  }
  

  
  try {
    if (action === 'add') {
      // Add a new task to the room
      await db.query('INSERT INTO room_todo_list (room_id, task, created_by) VALUES (?, ?, ?)', [roomId, task_description, user_id]);
      res.status(201).json({ message: 'Task added successfully' });
    } else {
      res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update to-do list' });
  }
});

// Expire Room
router.post('/:roomId/expire', async (req, res) => {
  const { roomId } = req.params;

  try {
    // Mark room as expired in the database
    await db.query('UPDATE studyroom SET status = "expired" WHERE room_id = ?', [roomId]);

    // Optionally clean up messages and tasks related to the expired room
    await db.query('DELETE FROM room_messages WHERE room_id = ?', [roomId]);
    await db.query('DELETE FROM room_todo_list WHERE room_id = ?', [roomId]);

    res.status(200).json({ message: 'Room expired and cleaned up successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to expire room' });
  }
});

module.exports = router;
