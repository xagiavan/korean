import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as gamificationService from '../services/gamificationService';
import type { AppFeatureProps } from '../types';
import { SRSIcon, SparklesIcon } from './icons/Icons';
import { useToast } from '../contexts/ToastContext';

interface LearningReminderProps extends AppFeatureProps {
    allStepsCompleted: boolean;
}

const getDaysSince = (dateString: string): number => {
    const lastDate = new Date(dateString);
    const today = new Date();
    // Reset time part to compare dates only
    lastDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};


const LearningReminder: React.FC<LearningReminderProps> = ({ allStepsCompleted, setActiveFeature }) => {
    const { currentUser } = useAuth();
    const { showBadgeCelebration } = useToast();
    const [daysInactive, setDaysInactive] = useState(0);
    const [goalCelebrationShown, setGoalCelebrationShown] = useState(false);

    useEffect(() => {
        const checkInactivity = async () => {
            if (currentUser?.email) {
                const state = await gamificationService.getGamificationState();
                const days = getDaysSince(state.lastActivityDate);
                setDaysInactive(days);
            }
        };
        checkInactivity();
    }, [currentUser, allStepsCompleted]);

    useEffect(() => {
        if (allStepsCompleted && !goalCelebrationShown) {
            showBadgeCelebration([]); // This will trigger confetti for goal completion
            setGoalCelebrationShown(true);
        }
    }, [allStepsCompleted, goalCelebrationShown, showBadgeCelebration]);


    if (allStepsCompleted) {
        return (
            <>
                <div className="my-8 p-4 bg-gradient-to-r from-green-50 to-cyan-50 dark:from-green-900/40 dark:to-cyan-900/40 rounded-lg shadow-md border border-green-200 dark:border-green-800 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
                    <div className="flex items-center gap-4 text-center sm:text-left">
                        <div className="p-3 bg-green-100 dark:bg-green-800 rounded-full hidden sm:block">
                            <SparklesIcon className="w-6 h-6 text-green-600 dark:text-green-300" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 dark:text-white">Bạn thật tuyệt vời! Đã hoàn thành mục tiêu hôm nay.</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-300">Sao không thử thách bản thân với một bài trắc nghiệm ngữ pháp nhỉ?</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setActiveFeature('grammarQuiz')}
                        className="flex-shrink-0 px-4 py-2 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition-colors mt-2 sm:mt-0"
                    >
                        Thử ngay
                    </button>
                </div>
            </>
        );
    }
    
    // Show inactivity reminder only if inactive for 2 or more days, and they haven't completed today's goal yet.
    if (!allStepsCompleted && daysInactive >= 2) {
        return (
             <div className="my-8 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/40 dark:to-red-900/40 rounded-lg shadow-md border border-orange-200 dark:border-orange-800 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
                <div className="flex items-center gap-4 text-center sm:text-left">
                     <div className="p-3 bg-orange-100 dark:bg-orange-800 rounded-full hidden sm:block">
                        <SRSIcon className="w-6 h-6 text-orange-600 dark:text-orange-300" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 dark:text-white">Chào mừng trở lại!</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">Đã {daysInactive} ngày bạn chưa luyện tập. Hãy dành vài phút ôn tập từ vựng để không bị quên kiến thức nhé!</p>
                    </div>
                </div>
                 <button 
                    onClick={() => setActiveFeature('srs')}
                    className="flex-shrink-0 px-4 py-2 bg-orange-500 text-white font-bold rounded-lg shadow-md hover:bg-orange-600 transition-colors mt-2 sm:mt-0"
                >
                    Ôn tập
                </button>
            </div>
        );
    }

    return null; // Don't show anything if user is active and has not completed goals yet
};

export default LearningReminder;