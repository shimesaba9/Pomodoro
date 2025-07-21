import React from 'react';

interface ActionButtonProps {
    isActive: boolean;
    onClick: () => void;
    buttonBg: string;
    buttonHoverBg: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ isActive, onClick, buttonBg, buttonHoverBg }) => {
    return (
        <button
            onClick={onClick}
            className={`w-48 h-16 text-2xl font-bold uppercase tracking-wider text-white rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50 ${buttonBg} ${buttonHoverBg}`}
        >
            {isActive ? 'Pause' : 'Start'}
        </button>
    );
};

export default ActionButton;