import React, { useState, useEffect } from 'react';
import { createRoom, getAllRooms } from '../utils/api';
import { motion } from 'framer-motion';
import { FaUsers, FaClock } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './StudyLounge.css';

const emojiAvatars = ['📚', '🧠', '🎓', '📝', '💡', '🤓'];

const StudyLounge = () => {
  const [topic, setTopic] = useState('');
  const [maxMembers, setMaxMembers] = useState(5);
  const [scheduledTime, setScheduledTime] = useState('');
  const [rooms, setRooms] = useState([]);

  const handleCreateRoom = async () => {
    if (!topic || !scheduledTime || !maxMembers) {
      toast.warn("Please fill all fields before creating a room!");
      return;
    }

    try {
      const createdRoom = await createRoom(topic, maxMembers, scheduledTime, 1); 
      toast.success(createdRoom.message || "Room created successfully!");
      fetchRooms();
      setTopic('');
      setMaxMembers(5);
      setScheduledTime('');
    } catch (error) {
      toast.error("Failed to create room");
    }
  };

  const fetchRooms = async () => {
    try {
      const roomList = await getAllRooms();
      setRooms(roomList);
    } catch (error) {
      console.error('Failed to fetch rooms');
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <motion.div
      className="study-lounge-fullscreen"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <ToastContainer position="top-right" autoClose={3000} />

      <header className="study-lounge-header">
        <h1 className="study-lounge-title">Study Lounge</h1>
      </header>

      <motion.div
        className="study-lounge-form-container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h3 className="study-lounge-form-title">Create a New Room</h3>
        <input
          className="study-lounge-input"
          type="text"
          placeholder="Room Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <input
          className="study-lounge-input"
          type="number"
          placeholder="Max Members"
          value={maxMembers}
          onChange={(e) => setMaxMembers(e.target.value)}
        />
        <input
          className="study-lounge-input"
          type="datetime-local"
          value={scheduledTime}
          onChange={(e) => setScheduledTime(e.target.value)}
        />
        <button className="study-lounge-button" onClick={handleCreateRoom}>Create Room</button>
      </motion.div>

      <motion.div
        className="study-lounge-rooms-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.4 }}
      >
        <h3 className="study-lounge-rooms-title">Available Rooms</h3>
        {rooms.length === 0 ? (
          <p className="study-lounge-no-rooms">No rooms available</p>
        ) : (
          <div className="room-cards-container">
            {rooms.map((room, index) => (
              <motion.div
                key={room.room_id}
                className="study-lounge-room-card"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="card-header">
                  <div className="avatar-emoji">{emojiAvatars[index % emojiAvatars.length]}</div>
                  <h4>{room.topic}</h4>
                  <div className="card-stats">
                    <div className="card-stat">
                      <FaUsers />
                      <span>{room.max_members} Members</span>
                    </div>
                    <div className="card-stat">
                      <FaClock />
                      <span>{new Date(room.scheduled_time).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <p className="card-description">Join this room for collaborative study sessions.</p>
                  <button
                    className="study-lounge-join-button"
                    onClick={() => toast.info(`Joined room ${room.room_id}`)}
                  >
                    Join Room
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default StudyLounge;
