import React, { useState, useEffect } from 'react';
import { createRoom, getAllRooms } from '../utils/api';
import { motion } from 'framer-motion';
import { FaUsers, FaClock } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import 'react-toastify/dist/ReactToastify.css';
import './StudyLounge.css';

const emojiAvatars = ['📚', '🧠', '🎓', '📝', '💡', '🤓'];

const StudyLounge = () => {
  const [topic, setTopic] = useState('');
  const [maxMembers, setMaxMembers] = useState(5);
  const [scheduledTime, setScheduledTime] = useState('');
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate(); // Initialize the navigate function

  // Function to create a room
  const handleCreateRoom = async () => {
    if (!topic || !scheduledTime || !maxMembers) {
      toast.warn("Please fill all fields before creating a room!");
      return;
    }

    try {
      const createdRoom = await createRoom(topic, maxMembers, scheduledTime, 1); 
      toast.success(createdRoom.message || "Room created successfully!");
      fetchRooms(); // Fetch the updated list of rooms after creation
      setTopic(''); // Reset form fields
      setMaxMembers(5);
      setScheduledTime('');
    } catch (error) {
      toast.error("Failed to create room");
    }
  };

  // Function to fetch all rooms
  const fetchRooms = async () => {
    try {
      const roomList = await getAllRooms();
      setRooms(roomList); // Set the fetched rooms to state
    } catch (error) {
      console.error('Failed to fetch rooms');
    }
  };

  useEffect(() => {
    fetchRooms(); // Fetch rooms on component mount
  }, []);

  // Function to handle joining a room
  const handleJoinRoom = async (roomId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'))
      const userId = user.student_id;  // Replace with actual logged-in user's ID
      const response = await fetch(`http://localhost:5000/api/study-lounge/${roomId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ student_id: userId }), // Send student_id as part of the request
      });
  
      const data = await response.json();
  
      if (response.ok) {
        toast.success('Joined the room successfully!');
        navigate(`/study-lounge/room/${roomId}`); // Navigate to the room details page
      } else {
        toast.error(data.error || 'Failed to join room');
      }
    } catch (error) {
      toast.error('An error occurred while joining the room');
      console.error('Error joining room:', error);
    }
  };
  

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
                    onClick={() => handleJoinRoom(room.room_id)} // Join room and navigate to its detail page
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
