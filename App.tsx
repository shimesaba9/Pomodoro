
import React, { useState, useEffect, useRef } from 'react';
import { TimerMode } from './types.ts';
import { DEFAULT_TIME_SETTINGS, MODE_CONFIG } from './constants.ts';
import TimerDisplay from './components/TimerDisplay.tsx';
import ModeSelector from './components/ModeSelector.tsx';
import ActionButton from './components/ActionButton.tsx';
import PomodoroCounter from './components/PomodoroCounter.tsx';
import { SettingsIcon } from './components/Icons.tsx';
import SettingsModal from './components/SettingsModal.tsx';

const getInitialTimeSettings = (): Record<TimerMode, number> => {
    try {
        const savedSettings = localStorage.getItem('pomodoroTimeSettings');
        if (savedSettings) {
            const parsedSettings = JSON.parse(savedSettings);
            delete parsedSettings.LONG_BREAK;
            return { ...DEFAULT_TIME_SETTINGS, ...parsedSettings };
        }
    } catch (error) {
        console.error("Error reading settings from localStorage", error);
    }
    return DEFAULT_TIME_SETTINGS;
};

const getInitialPomodoroCount = (): number => {
    try {
        const savedCount = localStorage.getItem('pomodoroCount');
        return savedCount ? parseInt(savedCount, 10) : 0;
    } catch (error) {
        console.error("Error reading pomodoro count from localStorage", error);
        return 0;
    }
};


const App: React.FC = () => {
    const [timeSettings, setTimeSettings] = useState<Record<TimerMode, number>>(getInitialTimeSettings);
    const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

    const [mode, setMode] = useState<TimerMode>(TimerMode.POMODORO);
    const [timeRemaining, setTimeRemaining] = useState<number>(timeSettings[mode]);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [pomodoroCount, setPomodoroCount] = useState<number>(getInitialPomodoroCount());
    
    const audioRef = useRef<HTMLAudioElement>(null);
    const intervalRef = useRef<number | null>(null);
    const config = MODE_CONFIG[mode];

    const formatTimeForTitle = (time: number): string => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    useEffect(() => {
        document.body.className = `antialiased transition-colors duration-500 ${config.bgColor}`;
        document.title = `${formatTimeForTitle(timeRemaining)} - ${config.label}`;
    }, [mode, timeRemaining, config]);

    useEffect(() => {
        try {
            localStorage.setItem('pomodoroCount', String(pomodoroCount));
        } catch (error) {
            console.error("Error saving pomodoro count to localStorage", error);
        }
    }, [pomodoroCount]);
    
    // Effect to manage the timer interval
    useEffect(() => {
        if (isActive) {
            intervalRef.current = window.setInterval(() => {
                setTimeRemaining(prev => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        } else {
            if (intervalRef.current) {
                window.clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                window.clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isActive]);

    // Effect to handle timer completion (auto-switching modes)
    useEffect(() => {
        if (isActive && timeRemaining === 0) {
            const handleTimerEnd = async () => {
                if (audioRef.current) {
                    try {
                        audioRef.current.currentTime = 0;
                        await audioRef.current.play();
                    } catch (e) {
                        console.error("Error playing sound:", e);
                    }
                }

                const isPomodoro = mode === TimerMode.POMODORO;
                if (isPomodoro) {
                    setPomodoroCount(prev => prev + 1);
                }
                
                const nextMode = isPomodoro ? TimerMode.SHORT_BREAK : TimerMode.POMODORO;
                setMode(nextMode);
            };

            handleTimerEnd();
        }
    }, [timeRemaining, isActive, mode]);

    // Effect to reset the timer's time when mode or settings change
    useEffect(() => {
        if (isNaN(timeSettings[mode])) {
            setTimeRemaining(DEFAULT_TIME_SETTINGS[mode]);
        } else {
            setTimeRemaining(timeSettings[mode]);
        }
    }, [mode, timeSettings]);

    const stopTimer = () => {
        if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsActive(false);
    };

    const toggleTimer = () => {
        // If timer is at 0 and user hits start, reset the current mode's timer before starting.
        if (!isActive && timeRemaining <= 0) {
            setTimeRemaining(timeSettings[mode]);
        }
        setIsActive(prev => !prev);
    };

    const selectMode = (newMode: TimerMode) => {
        if (isActive) {
            if (!window.confirm("The timer is running. Are you sure you want to switch? This will reset the current timer.")) {
                return;
            }
        }
        stopTimer();
        setMode(newMode);
    };

    const resetSession = () => {
        if (window.confirm('Are you sure you want to reset the session? This will reset the completed pomodoros count to 0.')) {
            stopTimer();
            setPomodoroCount(0);
        }
    };

    const handleSaveSettings = (newSettings: {
        time: { [TimerMode.POMODORO]: number; [TimerMode.SHORT_BREAK]: number; };
        count: number;
    }) => {
        stopTimer();
        const updatedTimeSettings = { ...timeSettings, ...newSettings.time };
        setTimeSettings(updatedTimeSettings);
        setPomodoroCount(newSettings.count);

        try {
            const settingsToSave = {
                [TimerMode.POMODORO]: updatedTimeSettings[TimerMode.POMODORO],
                [TimerMode.SHORT_BREAK]: updatedTimeSettings[TimerMode.SHORT_BREAK],
            };
            localStorage.setItem('pomodoroTimeSettings', JSON.stringify(settingsToSave));
        } catch (error) {
            console.error("Error saving time settings to localStorage", error);
        }
    };
    
    return (
        <main className={`min-h-screen flex flex-col items-center justify-center p-4 ${config.textColor}`}>
            <div className="absolute top-4 right-4">
                 <button onClick={() => setIsSettingsOpen(true)} className="p-2 text-white/80 hover:text-white transition-colors" title="Settings">
                    <SettingsIcon />
                </button>
            </div>
            
            <div className="w-full max-w-md mx-auto flex flex-col items-center space-y-8">
                <ModeSelector currentMode={mode} onSelectMode={selectMode} />

                <TimerDisplay timeInSeconds={timeRemaining} />

                <ActionButton 
                    isActive={isActive} 
                    onClick={toggleTimer} 
                    buttonBg={config.buttonBg}
                    buttonHoverBg={config.buttonHoverBg}
                />
            </div>

            <div className="absolute bottom-8">
                <PomodoroCounter count={pomodoroCount} onReset={resetSession} />
            </div>

            <audio ref={audioRef} src="data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABgAAABkYXRhAgAAAP8/"></audio>

            <SettingsModal 
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onSave={handleSaveSettings}
                currentTimeSettings={timeSettings}
                currentPomodoroCount={pomodoroCount}
            />
        </main>
    );
};

export default App;
