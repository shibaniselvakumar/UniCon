import React, { useState } from 'react';
import './MessageBoard.css';

const MessageBoard = ({ room_id, messages, user, disabled }) => {
  const [newMessage, setNewMessage] = useState('');

  const handlePostMessage = async () => {
    if (!newMessage.trim()) return;

    const res = await fetch(`http://localhost:5000/api/room-details/${room_id}/postMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: newMessage, user_id: user.student_id }),
    });

    const data = await res.json();
    if (res.ok) {
      messages.push({ message: newMessage, user_name: user.name });
      setNewMessage('');
    }
  };

  return (
    <div className="message-board">
      <h3>💬 Message Board</h3>
      <div className="messages">
        {messages.length === 0 ? <p>No messages yet</p> : (
          messages.map((msg, index) => (
            <div key={index} className="message">
              <strong>{msg.user_name}</strong>: {msg.message}
            </div>
          ))
        )}
      </div>
      {!disabled && (
        <div className="message-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button onClick={handlePostMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default MessageBoard;
