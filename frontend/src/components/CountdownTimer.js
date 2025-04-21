import React, { useEffect, useState } from 'react';
import './CountdownTimer.css';

const CountdownTimer = ({ scheduledTime, onExpire, isExpired }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (isExpired || !scheduledTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const target = new Date(scheduledTime);
      const diff = target - now;

      if (diff <= 0) {
        onExpire();
        clearInterval(interval);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [scheduledTime, isExpired]);

  if (isExpired) return null;

  return (
    <div className="countdown-timer">
      <p>⏰ Starts in: <strong>{timeLeft}</strong></p>
    </div>
  );
};

export default CountdownTimer;
