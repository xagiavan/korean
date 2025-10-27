

import React, { useState, useEffect } from 'react';
import { getStats, STATS_UPDATED_EVENT } from '../services/statsService';
import type { AppStats } from '../types';
import { PlayCircleIcon, CheckCircleIcon } from './icons/Icons';
import { useAuth } from '../contexts/AuthContext';

const UsageStats: React.FC = () => {
    const { currentUser } = useAuth();
    const [stats, setStats] = useState<AppStats | null>(null); 

    useEffect(() => {
        if (!currentUser?.email) return;

        const handleStatsUpdate = async () => {
            const newStats = await getStats();
            setStats(newStats);
        };
        
        window.addEventListener(STATS_UPDATED_EVENT, handleStatsUpdate);
        handleStatsUpdate(); // Initial fetch

        return () => {
            window.removeEventListener(STATS_UPDATED_EVENT, handleStatsUpdate);
        };
    }, [currentUser]);

    if (!currentUser) return null;

    if (!stats) {
        return (
            <div className="bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg animate-pulse">
                <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-2/3 mb-4"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-full mb-2"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-full"></div>
            </div>
        );
    }

    return (
        <div className="bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg">
            <h3 className="font-semibold text-sm text-slate-600 dark:text-slate-300 mb-2">Thống kê sử dụng</h3>
            <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 px-1">
                <span></span>
                <span>Hôm nay</span>
                <span>Tháng này</span>
            </div>
            <div className="space-y-2">
                <div className="flex items-center">
                    <PlayCircleIcon />
                    <div className="ml-2 flex-grow flex justify-between text-sm pr-1">
                        <span className="font-bold text-hanguk-blue-600 dark:text-hanguk-blue-400 w-10 text-center">{stats.today.listened}</span>
                        <span className="font-bold text-hanguk-blue-600 dark:text-hanguk-blue-400 w-10 text-center">{stats.thisMonth.listened}</span>
                    </div>
                </div>
                <div className="flex items-center">
                    <CheckCircleIcon />
                    <div className="ml-2 flex-grow flex justify-between text-sm pr-1">
                        <span className="font-bold text-hanguk-blue-600 dark:text-hanguk-blue-400 w-10 text-center">{stats.today.tested}</span>
                        <span className="font-bold text-hanguk-blue-600 dark:text-hanguk-blue-400 w-10 text-center">{stats.thisMonth.tested}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsageStats;