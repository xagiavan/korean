import React, { useState, useEffect } from 'react';
import * as gamificationService from '../services/gamificationService';
import type { GamificationState } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { FireIcon, StarIcon } from './icons/Icons';

const GAMIFICATION_UPDATED_EVENT = 'gamificationUpdated';

const GamificationHeader: React.FC = () => {
    const { currentUser } = useAuth();
    const [stats, setStats] = useState<GamificationState | null>(null);

    useEffect(() => {
        if (!currentUser?.email) return;
        
        const handleUpdate = async () => {
            const newStats = await gamificationService.getGamificationState();
            setStats(newStats);
        };
        
        window.addEventListener(GAMIFICATION_UPDATED_EVENT, handleUpdate);
        handleUpdate(); // Initial fetch

        return () => {
            window.removeEventListener(GAMIFICATION_UPDATED_EVENT, handleUpdate);
        };
    }, [currentUser]);
    
    if (!currentUser || !stats) {
        // Show a placeholder while loading
        return (
            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg mb-2 animate-pulse">
                <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full w-24 mb-3"></div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5"></div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full w-16 mt-1 ml-auto"></div>
            </div>
        );
    }

    const { xp, level, streak } = stats;
    const xpForNextLevel = gamificationService.getXpForLevel(level + 1);
    const xpForCurrentLevel = gamificationService.getXpForLevel(level);
    const levelProgress = xpForNextLevel > xpForCurrentLevel ? ((xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100 : 100;

    return (
        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg mb-2">
            <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm">Cấp {level}</span>
                <div className="flex items-center font-bold text-sm text-orange-500">
                    <span role="img" aria-label="streak">🔥</span>
                    <span className="ml-1">{streak}</span>
                </div>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                <div className="bg-hanguk-blue-600 h-2.5 rounded-full" style={{ width: `${levelProgress > 0 ? levelProgress : 0}%` }}></div>
            </div>
            <div className="text-right text-xs text-slate-500 dark:text-slate-400 mt-1">
                {xp} / {xpForNextLevel} XP
            </div>
        </div>
    );
};

export default GamificationHeader;
