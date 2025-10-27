
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as geminiService from '../services/geminiService';
import * as srsService from '../services/srsService';
import * as errorTrackingService from '../services/errorTrackingService';
import * as gamificationService from '../services/gamificationService';
import type { DailyDashboard, AppFeatureProps, GamificationState, DetailedVocabItem } from '../types';
import FeatureHeader from './FeatureHeader';
import Loader from './Loader';
import { RefreshIcon, InformationCircleIcon, SpeakerIcon, FireIcon } from './icons/Icons';
import UpgradeToVipPrompt from './UpgradeToVipPrompt';
import DailyGoalCard from './DailyGoalCard';
import LearningReminder from './LearningReminder';
import { speak } from '../services/ttsService';
import { apiClient } from '../services/apiClient';


const getTodayDateString = () => new Date().toISOString().split('T')[0];

const StatCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string | number;
    className?: string;
}> = ({ icon, label, value, className }) => (
    <div className={`flex items-center gap-3 p-4 rounded-lg bg-slate-100 dark:bg-slate-900/50 ${className}`}>
        <div className="flex-shrink-0">{icon}</div>
        <div>
            <div className="text-2xl font-bold text-slate-800 dark:text-white">{value}</div>
            <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</div>
        </div>
    </div>
);

interface StoredDashboard {
    date: string;
    plan: DailyDashboard['plan'];
    goal: DailyDashboard['goal'];
    completed: boolean[];
}

const PersonalizedPlan: React.FC<AppFeatureProps> = ({ setActiveFeature }) => {
    const { currentUser } = useAuth();
    const [dashboardData, setDashboardData] = useState<{
        plan: DailyDashboard['plan'] | null;
        goal: DailyDashboard['goal'] | null;
        stats: GamificationState | null;
        wordOfTheDay: DetailedVocabItem | null;
    }>({ plan: null, goal: null, stats: null, wordOfTheDay: null });

    const [isLoading, setIsLoading] = useState(true);
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [completedSteps, setCompletedSteps] = useState<boolean[]>([false, false, false]);
    const [showVipPrompt, setShowVipPrompt] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    
    const PLAN_STORAGE_KEY = `dailyDashboardData`; // No longer user-specific in key, handled by API

    const generateDailyDashboard = useCallback(async (forceRegenerate = false) => {
        if (!currentUser?.email) return;

        if (!forceRegenerate) setIsLoading(true);
        else setIsRegenerating(true);
        
        setApiError(null);
        const today = getTodayDateString();
        
        const isVip = currentUser?.isVip ?? false;
        setShowVipPrompt(!isVip && !forceRegenerate);

        // Fetch stats and word of the day concurrently
        const [stats, wordOfTheDayResponse] = await Promise.all([
            gamificationService.getGamificationState(),
            geminiService.getDetailedWordOfTheDay()
        ]);
        
        let planData: DailyDashboard | null = null;
        
        try {
            const storedData = await apiClient.get<StoredDashboard>(`/api/data/${PLAN_STORAGE_KEY}`);
            if (storedData && storedData.date === today && !forceRegenerate) {
                planData = { plan: storedData.plan, goal: storedData.goal };
                setCompletedSteps(storedData.completed);
            }
        } catch(e) {
            // No stored data, proceed to generate
        }
        
        if (!planData) {
            try {
                if (isVip) {
                    const srsCount = (await srsService.getReviewQueue()).length;
                    const commonErrors = await errorTrackingService.getCommonErrors(3);
                    const response = await geminiService.generateDailyDashboardData(srsCount, commonErrors);
                    planData = response.dashboard;
                    if (!response.isSuccess) setApiError(response.errorMessage || 'Lỗi tạo lộ trình.');
                } else {
                    planData = geminiService.sampleDailyDashboard;
                }

                if (planData) {
                    const newCompletedState = [false, false, false];
                    setCompletedSteps(newCompletedState);
                    await apiClient.post(`/api/data/${PLAN_STORAGE_KEY}`, { date: today, plan: planData.plan, goal: planData.goal, completed: newCompletedState });
                }
            } catch (e) {
                console.error(e);
                setApiError('Không thể tạo lộ trình học mới.');
                planData = geminiService.sampleDailyDashboard;
            }
        }
        
        setDashboardData({
            plan: planData?.plan || null,
            goal: planData?.goal || null,
            stats,
            wordOfTheDay: wordOfTheDayResponse.item
        });

        setIsLoading(false);
        setIsRegenerating(false);

    }, [currentUser, PLAN_STORAGE_KEY]);

    useEffect(() => {
        generateDailyDashboard();
    }, [generateDailyDashboard]);
    
    const handleStepCompletionToggle = useCallback(async (index: number) => {
        const newCompletedSteps = [...completedSteps];
        newCompletedSteps[index] = !newCompletedSteps[index];
        setCompletedSteps(newCompletedSteps);
        
        const today = getTodayDateString();
        await apiClient.post(`/api/data/${PLAN_STORAGE_KEY}`, { date: today, plan: dashboardData.plan, goal: dashboardData.goal, completed: newCompletedSteps });
    }, [completedSteps, dashboardData, PLAN_STORAGE_KEY]);

    const allStepsCompleted = completedSteps.every(Boolean);

    if (isLoading && !dashboardData.plan) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <Loader />
                <p className="mt-4 text-slate-500 dark:text-slate-400">Gia sư AI đang chuẩn bị bảng điều khiển cho bạn...</p>
            </div>
        );
    }
    
    const { plan, goal, stats, wordOfTheDay } = dashboardData;

    const xpForNextLevel = stats ? gamificationService.getXpForLevel(stats.level + 1) : 100;
    const xpForCurrentLevel = stats ? gamificationService.getXpForLevel(stats.level) : 0;
    const levelProgress = xpForNextLevel > xpForCurrentLevel && stats ? ((stats.xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100 : 0;

    return (
        <div className="max-w-4xl mx-auto relative">
            <div id="confetti-container" className="absolute inset-0 pointer-events-none z-50 overflow-hidden"></div>
            <div className="flex flex-wrap justify-between items-center gap-4">
                <FeatureHeader
                    title={`Chào mừng trở lại, ${currentUser?.email?.split('@')[0] || 'bạn'}!`}
                    description="Đây là tổng quan tiến độ và kế hoạch học tập dành riêng cho bạn hôm nay."
                />
                <button
                    onClick={() => generateDailyDashboard(true)}
                    disabled={isRegenerating}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg font-semibold hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors disabled:opacity-70 disabled:cursor-wait"
                    title="Tạo lộ trình mới"
                >
                    <RefreshIcon className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                    {isRegenerating ? 'Đang tạo...' : 'Tạo mới'}
                </button>
            </div>
            
             {apiError && (
                <div className="my-4 p-4 bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-300 rounded-r-lg flex items-start gap-3">
                    <InformationCircleIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="font-bold">Thông báo</p>
                        <p className="text-sm">{apiError}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
                {/* Stats Card */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md space-y-4">
                    <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200 mb-2">Tiến độ của bạn</h3>
                    {stats && (
                        <>
                            <div className="space-y-1">
                                <div className="flex justify-between items-baseline">
                                    <span className="font-bold text-lg">Cấp {stats.level}</span>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">{stats.xp} / {xpForNextLevel} XP</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                                    <div className="bg-hanguk-blue-600 h-2.5 rounded-full" style={{ width: `${levelProgress > 0 ? levelProgress : 0}%` }}></div>
                                </div>
                            </div>
                            <StatCard
                                icon={<FireIcon className="w-8 h-8 text-orange-500" />}
                                label="Chuỗi ngày học"
                                value={stats.streak}
                            />
                        </>
                    )}
                </div>

                {/* Word of the Day Card */}
                {wordOfTheDay && (
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-start">
                             <div>
                                <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200">Từ vựng của ngày</h3>
                                <p className="text-3xl font-bold text-hanguk-blue-700 dark:text-hanguk-blue-300 mt-2">{wordOfTheDay.word}</p>
                                <p className="text-md italic text-slate-500">{wordOfTheDay.romanization}</p>
                            </div>
                             <button onClick={() => speak(wordOfTheDay.word)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"><SpeakerIcon /></button>
                        </div>
                        <p className="mt-2 text-slate-600 dark:text-slate-300">{wordOfTheDay.details[0].meaning}</p>
                    </div>
                )}
            </div>

            {goal && !allStepsCompleted && <DailyGoalCard goal={goal} setActiveFeature={setActiveFeature} />}

            <LearningReminder allStepsCompleted={allStepsCompleted} setActiveFeature={setActiveFeature} />
            
            {showVipPrompt && <UpgradeToVipPrompt featureName="lộ trình học cá nhân hóa" setActiveFeature={setActiveFeature} isSampleData={true} />}

            {plan ? (
                <div className="space-y-6 mt-8">
                    {plan.map((step, index) => (
                        <div key={step.stepNumber} className={`p-6 rounded-lg shadow-md transition-all duration-300 flex items-start gap-4 ${completedSteps[index] ? 'bg-slate-50 dark:bg-slate-800/50 opacity-70' : 'bg-white dark:bg-slate-800'}`}>
                             <div className="flex flex-col items-center gap-2">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${completedSteps[index] ? 'bg-green-500 text-white' : 'bg-hanguk-blue-600 text-white'}`}>
                                    {step.stepNumber}
                                </div>
                                 <input
                                    type="checkbox"
                                    checked={completedSteps[index]}
                                    onChange={() => handleStepCompletionToggle(index)}
                                    className="w-5 h-5 rounded text-hanguk-blue-500 bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-hanguk-blue-500"
                                />
                             </div>

                            <div className="flex-grow">
                                <h3 className={`text-2xl font-bold ${completedSteps[index] ? 'line-through text-slate-500' : 'text-slate-800 dark:text-white'}`}>{step.title}</h3>
                                <p className={`mt-1 text-slate-600 dark:text-slate-300 ${completedSteps[index] ? 'line-through' : ''}`}>{step.description}</p>
                            </div>
                            
                             <button
                                onClick={() => setActiveFeature(step.featureTarget as any, step.targetTopic ? { topic: step.targetTopic } : null)}
                                disabled={completedSteps[index]}
                                className="self-center px-6 py-3 bg-hanguk-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-hanguk-blue-700 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
                            >
                                {step.cta}
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                 <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-lg shadow-md">
                    <p className="text-red-500">Không thể tạo lộ trình học tập. Vui lòng thử lại.</p>
                </div>
            )}
        </div>
    );
};

export default PersonalizedPlan;

const styleExistsConfetti = document.getElementById('confetti-styles');
if (!styleExistsConfetti) {
    const style = document.createElement('style');
    style.id = 'confetti-styles';
    style.textContent = `
      .confetti-piece {
        position: absolute;
        opacity: 0;
        animation: fall 5s linear infinite;
      }

      @keyframes fall {
        0% { transform: translateY(0vh) rotate(0deg); opacity: 1; }
        100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
      }
    `;
    document.head.append(style);
}
