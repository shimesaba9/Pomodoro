import React from 'react';
import { ResetIcon } from './Icons.tsx';

interface PomodoroCounterProps {
  count: number;
  onReset: () => void;
}

const PomodoroCounter: React.FC<PomodoroCounterProps> = ({ count, onReset }) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="text-center">
        <p className="text-lg">Completed Pomodoros</p>
        <p className="text-2xl font-bold">{count}</p>
      </div>
      <button 
        onClick={onReset} 
        className="p-2 rounded-full text-white/70 hover:bg-white/10 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Reset session"
        title="Reset session"
      >
        <ResetIcon />
      </button>
    </div>
  );
};

export default PomodoroCounter;