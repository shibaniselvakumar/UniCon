import React, { useState, useEffect } from 'react';
import { createRoom, getAllRooms } from '../utils/api';
import './StudyLounge.css'; // Importing the external CSS file

const StudyLounge = () => {
  const [topic, setTopic] = useState('');
  const [maxMembers, setMaxMembers] = useState(5);
  const [scheduledTime, setScheduledTime] = useState('');
  const [rooms, setRooms] = useState([]);

  // Handle creating a room
  const handleCreateRoom = async () => {
    try {
      const createdRoom = await createRoom(topic, maxMembers, scheduledTime, 1); // assuming created_by is 1
      alert(createdRoom.message);
      fetchRooms(); // Refresh the room list after creation
    } catch (error) {
      alert('Failed to create room');
    }
  };

  // Fetch all rooms
  const fetchRooms = async () => {
    try {
      const roomList = await getAllRooms();
      setRooms(roomList);
    } catch (error) {
      console.error('Failed to fetch rooms');
    }
  };

  // Load rooms on component mount
  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="study-lounge-container">
      <h1 className="study-lounge-title">Study Lounge</h1>
      <div className="study-lounge-form-container">
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
      </div>

      <div className="study-lounge-rooms-container">
        <h3 className="study-lounge-rooms-title">Available Rooms</h3>
        {rooms.length === 0 ? (
          <p className="study-lounge-no-rooms">No rooms available</p>
        ) : (
          <ul className="study-lounge-rooms-list">
            {rooms.map((room) => (
              <li key={room.room_id} className="study-lounge-room-item">
                {room.topic} (Max: {room.max_members} members)
                <button className="study-lounge-join-button" onClick={() => alert(`Joined room ${room.room_id}`)}>
                  Join Room
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default StudyLounge;
