const express = require('express');
const router = express.Router();
const db = require('../db');

// Create Study Room
router.post('/create', async (req, res) => {
  const { topic, max_members, scheduled_time, created_by } = req.body;

  if (!topic || !max_members || !scheduled_time || !created_by) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (isNaN(max_members)) {
    return res.status(400).json({ error: 'Max members should be a number' });
  }

  try {
    await db.query('CALL CreateRoom(?, ?, ?, ?)', [topic, max_members, scheduled_time, created_by]);
    res.status(201).json({ message: 'Room created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

// Join Study Room
router.post('/join', async (req, res) => {
  const { room_id, student_id } = req.body;

  if (!room_id || !student_id) {
    return res.status(400).json({ error: 'Room ID and Student ID are required' });
  }

  try {
    const [room] = await db.query('SELECT * FROM studyroom WHERE room_id = ?', [room_id]);

    if (room.length === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }

    await db.query('INSERT INTO room_members (room_id, user_id) VALUES (?, ?)', [room_id, student_id]);
    res.status(200).json({ message: 'Joined room successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to join room' });
  }
});

// Get All Study Rooms with Members
router.get('/rooms', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        s.room_id, s.topic, s.max_members, s.scheduled_time, s.created_by, 
        rm.user_id AS student_id, rm.joined_at
      FROM studyroom s
      LEFT JOIN room_members rm ON s.room_id = rm.room_id
      ORDER BY s.room_id
    `);

    const rooms = {};
    rows.forEach(row => {
      if (!rooms[row.room_id]) {
        rooms[row.room_id] = {
          room_id: row.room_id,
          topic: row.topic,
          max_members: row.max_members,
          scheduled_time: row.scheduled_time,
          created_by: row.created_by,
          members: []
        };
      }
      if (row.student_id) {
        rooms[row.room_id].members.push({
          student_id: row.student_id,
          joined_at: row.joined_at
        });
      }
    });

    res.json(Object.values(rooms));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// Delete Room
router.delete('/delete', async (req, res) => {
  const { room_id, creator_id } = req.body;

  try {
    const [roomResult] = await db.query('SELECT created_by FROM studyroom WHERE room_id = ?', [room_id]);

    if (roomResult.length === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const room = roomResult[0];
    if (room.created_by === creator_id) {
      await db.query('DELETE FROM room_members WHERE room_id = ?', [room_id]);
      await db.query('DELETE FROM studyroom WHERE room_id = ?', [room_id]);
      res.status(200).json({ message: 'Room deleted successfully' });
    } else {
      res.status(403).json({ error: 'You are not authorized to delete this room' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete room' });
  }
});

// Get details of a single room
router.get('/:roomId', async (req, res) => {
  const { roomId } = req.params;

  try {
    const [room] = await db.query('SELECT * FROM studyroom WHERE room_id = ?', [roomId]);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const [members] = await db.query('SELECT * FROM room_members WHERE room_id = ?', [roomId]);

    res.json({ room, members });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch room details' });
  }
});

// Join Study Room
router.post('/:roomId/join', async (req, res) => {
  const { roomId } = req.params; // roomId from URL
  const { student_id } = req.body; // student_id from request body

  if (!roomId || !student_id) {
    return res.status(400).json({ error: 'Room ID and Student ID are required' });
  }

  try {
    const [room] = await db.query('SELECT * FROM studyroom WHERE room_id = ?', [roomId]);

    if (room.length === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Check if the room has available slots
    const [roomMemberCount] = await db.query('SELECT COUNT(*) AS memberCount FROM room_members WHERE room_id = ?', [roomId]);
    if (roomMemberCount[0].memberCount >= room[0].max_members) {
      return res.status(400).json({ error: 'Room is full' });
    }

    // Add the user to the room
    await db.query('INSERT INTO room_members (room_id, user_id) VALUES (?, ?)', [roomId, student_id]);
    res.status(200).json({ message: 'Joined room successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to join room' });
  }
});


module.exports = router;
