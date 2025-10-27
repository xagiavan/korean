import React from 'react';

interface CircularProgressProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ score, size = 160, strokeWidth = 14 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const scoreColor = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#e5e7eb"
                strokeWidth={strokeWidth}
                fill="transparent"
                className="dark:stroke-slate-700"
            />
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={scoreColor}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
             <span className="text-4xl font-bold text-slate-700 dark:text-slate-200">{score}</span>
             <span className="text-sm text-slate-500 dark:text-slate-400">/ 100</span>
        </div>
    </div>
  );
};

export default CircularProgress;