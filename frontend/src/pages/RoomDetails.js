import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CountdownTimer from '../components/CountdownTimer';
import MessageBoard from '../components/MessageBoard';
import RoomMembers from '../components/RoomMembers';
import ShowJoinLeaveNotification from '../components/showJoinLeaveNotification';
import TodoList from '../components/ToDoList';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import './RoomDetails.css'; // Import your CSS file for styling

const RoomPage = () => {
  const { roomId } = useParams();  // This will get the room ID from the URL
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');  // Get user from local storage
  const [roomDetails, setRoomDetails] = useState(null);  // State to store room details
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [todoList, setTodoList] = useState([]);
  const [expired, setExpired] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [joined, setJoined] = useState(false);



  const fetchMemberNames = async (members) => {
    try {
      const ids = members.map(member => member.user_id);
      console.log('mem', members);
      const response = await axios.post('http://localhost:5000/api/student/names', { ids });
      // Expected response: [{ student_id: 1, name: 'Aditi' }, { student_id: 2, name: 'Rahul' }]
      const idToNameMap = {};
      response.data.forEach(student => {
        idToNameMap[student.student_id] = student.name;
      });
  
      // Merge names into members
      const membersWithNames = members.map(member => ({
        ...member,
        name: idToNameMap[member.user_id] || 'Unknown',
      }));
  
      setMembers(membersWithNames);
 
    } catch (error) {
      toast.error('Error fetching member names');
    }
  };
  
  // Fetch room details when the component mounts
  useEffect(() => {
  const fetchRoomDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/study-lounge/${roomId}`);
      setRoomDetails(response.data);
     

      if (response.data.members && response.data.members.length > 0) {
        fetchMemberNames(response.data.members);
      
      }
    
    } catch (error) {
      toast.error('Error fetching room details');
    }
  };

  fetchRoomDetails();
}, [roomId]);
 // The effect runs again whenever roomId changes

  // Function to expire the room (called when the countdown ends)
  const expireRoom = async () => {
    try {
      await axios.post(`http://localhost:5000/api/room-details/${roomId}/expire`);
      setExpired(true);
      toast.info('This room has expired!');
    } catch (err) {
      toast.error('Error expiring room');
    }
  };

  // Handle updating the to-do list
  const handleTodoUpdate = (newTodos) => {
    setTodoList(newTodos);
    const allDone = newTodos.length > 0 && newTodos.every(todo => todo.completed);
    if (allDone) {
      setShowConfetti(true);
      toast.success('🎯 Study goals completed for this session!');
      setTimeout(() => setShowConfetti(false), 4000);
    }
  };

  useEffect(() => {
    if (!expired && roomDetails) {
      const now = new Date();
      const scheduledTime = new Date(roomDetails.room[0].scheduled_time);
  

      if (now > scheduledTime) {
        expireRoom();
      }
    }
  }, [roomDetails, expired]);

  // If roomDetails is not loaded, you can show a loading spinner or something else
  if (!roomDetails) {
    return <div>Loading...</div>;
  }


return (
  <div className={`room-page starwars-theme ${expired ? 'expired' : ''}`}>
    <header className="room-header">
      <h1 className="room-title">{roomDetails.room[0].topic || 'Study Room'}</h1>
      {expired && <div className="expired-banner">🛑 This room has expired!</div>}
    </header>

    <div className="room-body">
      {/* Left Sidebar */}
      <div className="left-panel">
        <div className="countdown-wrapper">
          <CountdownTimer
            scheduledTime={roomDetails.room[0].scheduled_time}
            onExpire={expireRoom}
            isExpired={expired}
          />
        </div>
        <div className="members-wrapper">
          <RoomMembers members={members} />
        </div>
      </div>

      {/* Center Main */}
      <div className="center-panel">
        <div className="messages-wrapper">
          <MessageBoard
            room_id={roomId}
            messages={messages}
            user={user}
            disabled={expired}
          />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="right-panel">
        <div className="todo-wrapper">
          <TodoList
            room_id={roomId}
            todos={todoList}
            user={user}
            onUpdate={handleTodoUpdate}
            disabled={expired}
          />
        </div>
      </div>
    </div>

    <ShowJoinLeaveNotification />
    {showConfetti && <Confetti />}
  </div>
);
}


export default RoomPage;
