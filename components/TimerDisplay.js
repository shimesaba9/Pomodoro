import React from 'react';

const TimerDisplay = ({ timeInSeconds }) => {
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="text-8xl md:text-9xl font-bold">
      {formatTime(timeInSeconds)}
    </div>
  );
};

export default TimerDisplay;