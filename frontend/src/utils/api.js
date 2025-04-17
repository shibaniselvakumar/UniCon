import axios from 'axios';

// Base URL for your backend API
const API_URL = 'http://localhost:5000/api/study-lounge';

// Create a Study Room
export const createRoom = async (topic, max_members, scheduled_time, created_by) => {
  try {
    const response = await axios.post(`${API_URL}/create`, {
      topic,
      max_members,
      scheduled_time,
      created_by
    });
    return response.data;
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
};

// Join a Study Room
export const joinRoom = async (room_id, student_id) => {
  try {
    const response = await axios.post(`${API_URL}/join`, {
      room_id,
      student_id
    });
    return response.data;
  } catch (error) {
    console.error('Error joining room:', error);
    throw error;
  }
};

// Get All Study Rooms
export const getAllRooms = async () => {
  try {
    const response = await axios.get(`${API_URL}/rooms`);
    return response.data;
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw error;
  }
};

// Delete a Room
export const deleteRoom = async (room_id, creator_id) => {
  try {
    const response = await axios.delete(`${API_URL}/delete`, {
      data: { room_id, creator_id }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting room:', error);
    throw error;
  }
};
