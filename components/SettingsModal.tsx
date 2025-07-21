
import React, { useState, useEffect, useMemo } from 'react';
import { TimerMode } from '../types.ts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newSettings: {
    time: { [TimerMode.POMODORO]: number; [TimerMode.SHORT_BREAK]: number; };
    count: number;
  }) => void;
  currentTimeSettings: { [key in TimerMode]: number };
  currentPomodoroCount: number;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, currentTimeSettings, currentPomodoroCount }) => {
  const [pomodoroTime, setPomodoroTime] = useState(String(currentTimeSettings[TimerMode.POMODORO] / 60));
  const [breakTime, setBreakTime] = useState(String(currentTimeSettings[TimerMode.SHORT_BREAK] / 60));
  const [count, setCount] = useState(String(currentPomodoroCount));

  useEffect(() => {
    if (isOpen) {
        setPomodoroTime(String(currentTimeSettings[TimerMode.POMODORO] / 60));
        setBreakTime(String(currentTimeSettings[TimerMode.SHORT_BREAK] / 60));
        setCount(String(currentPomodoroCount));
    }
  }, [currentTimeSettings, currentPomodoroCount, isOpen]);

  const isValid = useMemo(() => {
    const validate = (value: string, min: number) => {
        // Must be a non-empty string of digits.
        if (!/^\d+$/.test(value)) return false;
        const num = parseInt(value, 10);
        return num >= min;
    };

    return validate(pomodoroTime, 1) &&
           validate(breakTime, 1) &&
           validate(count, 0);
  }, [pomodoroTime, breakTime, count]);


  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    if (!isValid) return;

    onSave({
      time: {
        [TimerMode.POMODORO]: parseInt(pomodoroTime, 10) * 60,
        [TimerMode.SHORT_BREAK]: parseInt(breakTime, 10) * 60,
      },
      count: parseInt(count, 10),
    });
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white/95 dark:bg-slate-800/95 text-slate-800 dark:text-slate-200 rounded-lg shadow-2xl p-6 md:p-8 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-900 dark:text-white">Settings</h2>
        
        <div className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="pomodoro" className="mb-2 font-semibold text-slate-600 dark:text-slate-300">Pomodoro (minutes)</label>
            <input
              id="pomodoro"
              type="number"
              min="1"
              value={pomodoroTime}
              onChange={(e) => setPomodoroTime(e.target.value)}
              className="p-3 rounded-md bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="break" className="mb-2 font-semibold text-slate-600 dark:text-slate-300">Break (minutes)</label>
            <input
              id="break"
              type="number"
              min="1"
              value={breakTime}
              onChange={(e) => setBreakTime(e.target.value)}
              className="p-3 rounded-md bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
           <div className="flex flex-col">
            <label htmlFor="pomodoro-count" className="mb-2 font-semibold text-slate-600 dark:text-slate-300">Completed Pomodoros</label>
            <input
              id="pomodoro-count"
              type="number"
              min="0"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              className="p-3 rounded-md bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              aria-label="Completed Pomodoros"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-md text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors font-semibold"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={!isValid}
            className="px-6 py-2 rounded-md text-white bg-indigo-500 hover:bg-indigo-600 transition-colors font-semibold disabled:bg-indigo-300 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;