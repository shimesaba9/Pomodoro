import React from 'react';
import { TimerMode } from '../types';
import { MODE_CONFIG } from '../constants';

interface ModeSelectorProps {
  currentMode: TimerMode;
  onSelectMode: (mode: TimerMode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onSelectMode }) => {
  return (
    <div className="bg-black/10 p-2 rounded-full flex items-center space-x-2">
      {(Object.keys(TimerMode) as Array<keyof typeof TimerMode>).map((key) => {
        const mode = TimerMode[key];
        const isActive = currentMode === mode;
        return (
          <button
            key={mode}
            onClick={() => onSelectMode(mode)}
            className={`px-4 py-2 text-sm md:text-base font-semibold rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 ${
              isActive ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10'
            }`}
          >
            {MODE_CONFIG[mode].label}
          </button>
        );
      })}
    </div>
  );
};

export default ModeSelector;