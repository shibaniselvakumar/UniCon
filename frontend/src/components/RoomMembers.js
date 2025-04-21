import React from 'react';
import './RoomMembers.css';
import { FaUserCircle } from 'react-icons/fa';



const RoomMembers = ({ members }) => {
  return (
    <div className="room-members">
      <h3>👥 Room Members</h3>
      {members.length === 0 ? (
        <p>No members yet</p>
      ) : (
        <ul>
          {members.map((member) => (
            <li key={member.id}>
              <FaUserCircle className="member-icon" />
              {member.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RoomMembers;
