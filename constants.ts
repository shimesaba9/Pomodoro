import { TimerMode } from './types';

export const DEFAULT_TIME_SETTINGS = {
  [TimerMode.POMODORO]: 25 * 60, // 25 minutes
  [TimerMode.SHORT_BREAK]: 5 * 60, // 5 minutes
};

export const MODE_CONFIG = {
    [TimerMode.POMODORO]: {
        label: 'Pomodoro',
        bgColor: 'bg-red-500',
        textColor: 'text-red-100',
        buttonBg: 'bg-red-600',
        buttonHoverBg: 'hover:bg-red-700',
    },
    [TimerMode.SHORT_BREAK]: {
        label: 'Break',
        bgColor: 'bg-cyan-500',
        textColor: 'text-cyan-100',
        buttonBg: 'bg-cyan-600',
        buttonHoverBg: 'hover:bg-cyan-700',
    },
};