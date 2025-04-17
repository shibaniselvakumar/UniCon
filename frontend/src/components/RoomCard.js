import React from 'react';

const RoomCard = ({ room }) => {
  const handleJoin = async () => {
    const response = await fetch('http://localhost:5000/api/studyLounge/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        room_id: room.room_id,
        student_id: 2 // Replace with dynamic user ID
      })
    });

    if (response.ok) {
      alert('Joined room successfully');
    } else {
      alert('Failed to join room');
    }
  };

  return (
    <div>
      <h3>{room.topic}</h3>
      <p>Max Members: {room.max_members}</p>
      <button onClick={handleJoin}>Join Room</button>
    </div>
  );
};

export default RoomCard;
