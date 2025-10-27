import React, { useState, useEffect, useCallback } from 'react';
import type { AppFeatureProps, LeaderboardUser, WeeklyQuest, League } from '../types';
import { useAuth } from '../contexts/AuthContext';
import * as gamificationService from '../services/gamificationService';
import FeatureHeader from './FeatureHeader';
import Loader from './Loader';
import { TrophyIcon, SparklesIcon, RefreshIcon } from './icons/Icons';
import UpgradeToVipPrompt from './UpgradeToVipPrompt';
import { useToast } from '../contexts/ToastContext';

const leagues: Record<string, League> = {
    bronze: { id: 'bronze', name: 'Giải Đồng', iconColor: 'text-yellow-600' },
    silver: { id: 'silver', name: 'Giải Bạc', iconColor: 'text-slate-400' },
    gold: { id: 'gold', name: 'Giải Vàng', iconColor: 'text-yellow-400' },
    diamond: { id: 'diamond', name: 'Giải Kim Cương', iconColor: 'text-cyan-400' },
};

const Competition: React.FC<AppFeatureProps> = ({ setActiveFeature }) => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
    const [quests, setQuests] = useState<WeeklyQuest[]>([]);
    const [completedQuests, setCompletedQuests] = useState<Set<string>>(new Set());
    const [currentLeague, setCurrentLeague] = useState<League>(leagues.bronze);
    const [timeLeft, setTimeLeft] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshingQuests, setIsRefreshingQuests] = useState(false);

    const loadInitialData = useCallback(async () => {
        if (!currentUser?.email) return;
        setIsLoading(true);

        const state = await gamificationService.getGamificationState();
        const boardData = gamificationService.getLeaderboardData(currentUser.email, state.xp);
        setLeaderboard(boardData);
        setCompletedQuests(new Set(state.completedQuestIds || []));

        const { quests: newQuests, isSuccess, errorMessage } = await gamificationService.generateWeeklyQuests(currentUser.email);
        setQuests(newQuests);
        if (!isSuccess && currentUser.isVip) { 
            addToast({type: 'warning', title: 'Lỗi AI', message: errorMessage || 'Không thể tạo nhiệm vụ cá nhân hóa, đã tải nhiệm vụ mẫu.'});
        }
        
        setIsLoading(false);
    }, [currentUser, addToast]);

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const endOfWeek = new Date(now);
            endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
            endOfWeek.setHours(23, 59, 59, 999);
            
            const diff = endOfWeek.getTime() - now.getTime();
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            setTimeLeft(`${days} ngày ${hours} giờ ${minutes} phút`);
        };
        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleRefreshQuests = async () => {
        if (!currentUser?.isVip || !currentUser?.email) {
            addToast({type: 'warning', title: 'Tính năng VIP', message: 'Làm mới nhiệm vụ là tính năng dành cho tài khoản VIP.'});
            return;
        }
        setIsRefreshingQuests(true);
        const { quests: newQuests, isSuccess } = await gamificationService.generateWeeklyQuests(currentUser.email);
        if(isSuccess) {
            setQuests(newQuests);
            addToast({type: 'success', title: 'Hoàn tất', message: 'Nhiệm vụ mới đã được tạo!'});
        } else {
            addToast({type: 'error', title: 'Lỗi', message: 'Không thể tạo nhiệm vụ mới lúc này.'});
        }
        setIsRefreshingQuests(false);
    };

    const handleCompleteQuest = async (quest: WeeklyQuest) => {
        if (!currentUser?.email || completedQuests.has(quest.id)) return;
        
        await gamificationService.addXp(quest.xp);
        await gamificationService.recordQuestCompletion(quest.id);
        
        const newCompleted = new Set(completedQuests).add(quest.id);
        setCompletedQuests(newCompleted);

        addToast({type: 'success', title: 'Nhiệm vụ Hoàn thành!', message: `Bạn nhận được +${quest.xp} XP!`});
        
        const updatedState = await gamificationService.getGamificationState();
        setLeaderboard(gamificationService.getLeaderboardData(currentUser.email, updatedState.xp));
    };

    if (isLoading) {
        return <div className="min-h-[50vh] flex items-center justify-center"><Loader /></div>;
    }

    return (
        <div>
            <FeatureHeader title="Đấu Trường Tri Thức" description="Hoàn thành nhiệm vụ tuần, kiếm XP và leo lên top đầu bảng xếp hạng!" />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Quests */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg">Nhiệm vụ Tuần</h3>
                            <button onClick={handleRefreshQuests} disabled={isRefreshingQuests} className="flex items-center gap-1 text-xs font-semibold text-hanguk-blue-600 dark:text-hanguk-blue-400 p-1 rounded-md hover:bg-hanguk-blue-100 dark:hover:bg-hanguk-blue-900 disabled:opacity-50">
                                {isRefreshingQuests ? <Loader size="sm" inline/> : <RefreshIcon small/>} Làm mới
                            </button>
                        </div>
                        {!currentUser?.isVip && <p className="text-xs text-slate-500">(Nâng cấp VIP để làm mới nhiệm vụ)</p>}
                    </div>

                    {quests.length === 0 && !isRefreshingQuests ? (
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md text-center flex flex-col items-center">
                            <SparklesIcon className="w-12 h-12 text-hanguk-blue-400 mb-4" />
                            <h4 className="font-semibold text-slate-600 dark:text-slate-300">Gia sư AI đang chuẩn bị nhiệm vụ mới.</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                {currentUser?.isVip ? "Vui lòng thử làm mới hoặc quay lại sau." : "Nâng cấp VIP để nhận nhiệm vụ cá nhân hóa!"}
                            </p>
                            {!currentUser?.isVip && (
                                 <button onClick={() => setActiveFeature('upgrade')} className="mt-4 px-4 py-2 bg-hanguk-blue-100 dark:bg-hanguk-blue-900 text-hanguk-blue-700 dark:text-hanguk-blue-300 font-semibold rounded-lg text-sm hover:bg-hanguk-blue-200 dark:hover:bg-hanguk-blue-800 transition-colors">
                                    Nâng cấp ngay
                                </button>
                            )}
                        </div>
                    ) : quests.map(quest => {
                        const isCompleted = completedQuests.has(quest.id);
                        return (
                            <div key={quest.id} className={`p-4 rounded-lg shadow-md transition-all ${isCompleted ? 'bg-slate-50 dark:bg-slate-800/50 opacity-70' : 'bg-white dark:bg-slate-800'}`}>
                                <div className="flex justify-between items-start">
                                    <h4 className={`font-bold ${isCompleted ? 'line-through' : ''}`}>{quest.title}</h4>
                                    <span className={`font-bold text-sm px-2 py-0.5 rounded-full ${isCompleted ? 'bg-slate-200 text-slate-500' : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200'}`}>+{quest.xp} XP</span>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 my-2">{quest.description}</p>
                                <button
                                    onClick={() => isCompleted ? setActiveFeature(quest.featureTarget) : handleCompleteQuest(quest)}
                                    className={`w-full text-sm font-bold py-2 rounded-md transition-colors ${isCompleted ? 'bg-green-500 text-white' : 'bg-hanguk-blue-600 text-white hover:bg-hanguk-blue-700'}`}
                                >
                                    {isCompleted ? 'Đã hoàn thành!' : 'Hoàn thành (Demo)'}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Right Column: Leaderboard */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-lg shadow-md p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 pb-4 border-b border-slate-200 dark:border-slate-700 gap-2">
                        <div className="flex items-center gap-2">
                            <TrophyIcon className={`w-8 h-8 ${currentLeague.iconColor}`} />
                            <h3 className="text-xl font-bold">{currentLeague.name}</h3>
                        </div>
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Kết thúc sau: {timeLeft}</p>
                    </div>
                    
                    <ul className="space-y-1">
                        {leaderboard.map(user => {
                            let rankClass = "bg-slate-200 dark:bg-slate-600";
                            if (user.rank <= 5) rankClass = "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300";
                            if (user.rank > 25) rankClass = "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300";
                            
                            return (
                                <li key={user.rank} className={`flex items-center p-2 rounded-lg transition-colors ${user.isCurrentUser ? 'bg-hanguk-blue-100 dark:bg-hanguk-blue-900 border-2 border-hanguk-blue-500' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mr-3 ${rankClass}`}>
                                        {user.rank}
                                    </div>
                                    <span className="font-semibold flex-grow">{user.name}</span>
                                    <span className="font-bold text-hanguk-blue-600 dark:text-hanguk-blue-400">{user.xp} XP</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Competition;