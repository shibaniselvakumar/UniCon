import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

const ShowJoinLeaveNotification = () => {
  useEffect(() => {
    // Just a mockup - you can connect it to real-time updates or WebSocket
    const joinNotification = () => {
      toast.info('🎉 A new member has joined the room!');
    };

    // Simulate join notification every 20 sec (for testing)
    const interval = setInterval(joinNotification, 20000);

    return () => clearInterval(interval);
  }, []);

  return null; // This component only triggers notifications
};

export default ShowJoinLeaveNotification;
