import React from 'react';
import type { DailyGoal } from '../types';
import { LightbulbIcon } from './icons/Icons';

type Feature = 'plan' | 'srs' | 'conversations' | 'roleplay' | 'quiz' | 'media' | 'grammarQuiz';

interface DailyGoalCardProps {
    goal: DailyGoal;
    setActiveFeature: (feature: Feature, payload?: any) => void;
}

const DailyGoalCard: React.FC<DailyGoalCardProps> = ({ goal, setActiveFeature }) => {
    return (
        <div className="mb-8 p-6 rounded-lg shadow-md bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900/40 dark:to-orange-900/50 border border-yellow-200 dark:border-yellow-800 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="p-3 bg-yellow-400/30 rounded-full">
                    <LightbulbIcon className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="flex-grow">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Mục tiêu hôm nay: {goal.title}</h3>
                    <p className="text-slate-600 dark:text-slate-300">{goal.description}</p>
                </div>
                <button
                    onClick={() => setActiveFeature(goal.featureTarget, goal.targetTopic ? { topic: goal.targetTopic } : null)}
                    className="mt-2 sm:mt-0 self-start sm:self-center px-6 py-3 bg-yellow-500 text-white font-bold rounded-lg shadow-md hover:bg-yellow-600 transition-colors flex-shrink-0"
                >
                    {goal.cta}
                </button>
            </div>
        </div>
    );
};

export default DailyGoalCard;