import React, { useState, useEffect } from 'react';
import * as gamificationService from '../services/gamificationService';
import type { GamificationState } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { FireIcon, StarIcon } from './icons/Icons';

const GAMIFICATION_UPDATED_EVENT = 'gamificationUpdated';

const HeaderStats: React.FC = () => {
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
    
    if (!stats) return null; // Don't render anything until stats are loaded

    return (
        <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-700/50 px-3 py-1.5 rounded-full">
            <div className="flex items-center gap-1 font-semibold text-sm text-slate-600 dark:text-slate-300" title={`Cấp độ ${stats.level}`}>
                <StarIcon className="w-5 h-5 text-yellow-400" />
                <span>{stats.level}</span>
            </div>
            <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
            <div className="flex items-center gap-1 font-semibold text-sm text-slate-600 dark:text-slate-300" title={`Chuỗi ${stats.streak} ngày học`}>
                <FireIcon className="w-5 h-5 text-orange-500" />
                <span>{stats.streak}</span>
            </div>
        </div>
    );
};

export default HeaderStats;
