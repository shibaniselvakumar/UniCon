import React, { useState } from 'react';

const CreateRoomForm = () => {
  const [topic, setTopic] = useState('');
  const [maxMembers, setMaxMembers] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch('http://localhost:5000/api/studyLounge/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        topic,
        max_members: maxMembers,
        scheduled_time: scheduledTime,
        created_by: 1 // Replace with dynamic user ID
      })
    });

    if (response.ok) {
      alert('Room created successfully');
    } else {
      alert('Failed to create room');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic" />
      <input type="number" value={maxMembers} onChange={(e) => setMaxMembers(e.target.value)} placeholder="Max Members" />
      <input type="datetime-local" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} />
      <button type="submit">Create Room</button>
    </form>
  );
};

export default CreateRoomForm;
