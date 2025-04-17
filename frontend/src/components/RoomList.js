import React, { useState, useEffect } from 'react';
import RoomCard from './RoomCard';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const response = await fetch('http://localhost:5000/api/studyLounge/rooms');
      const data = await response.json();
      setRooms(data);
    };

    fetchRooms();
  }, []);

  return (
    <div>
      {rooms.map((room) => (
        <RoomCard key={room.room_id} room={room} />
      ))}
    </div>
  );
};

export default RoomList;
