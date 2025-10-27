import React from 'react';
import type { AppFeatureProps } from '../types';
import { SparklesIcon, UserIcon, ListBulletIcon } from './icons/Icons';

interface ContextualActionBarProps extends AppFeatureProps {
  word: string;
}

const ContextualActionBar: React.FC<ContextualActionBarProps> = ({ word, setActiveFeature }) => {
    const actions = [
        {
            label: "Giải thích Ngữ pháp",
            icon: <SparklesIcon small />,
            feature: 'grammarHelper',
            payload: { query: `Giải thích ngữ pháp hoặc cách dùng của từ "${word}"` }
        },
        {
            label: "Nhập vai AI",
            icon: <UserIcon small />,
            feature: 'roleplay',
            payload: { word }
        },
        {
            label: "Cụm từ thông dụng",
            icon: <ListBulletIcon small />,
            feature: 'phrases',
            payload: { searchTerm: word }
        }
    ];

    return (
        <div className="mt-6 pt-4 border-t border-dashed border-slate-300 dark:border-slate-600">
            <h4 className="text-sm font-bold mb-3 text-slate-600 dark:text-slate-300">Học sâu hơn với "{word}":</h4>
            <div className="flex flex-col sm:flex-row gap-2">
                {actions.map(action => (
                    <button
                        key={action.feature}
                        onClick={() => setActiveFeature(action.feature as any, action.payload)}
                        className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold p-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-hanguk-blue-100 dark:hover:bg-hanguk-blue-900 hover:text-hanguk-blue-700 dark:hover:text-hanguk-blue-300 transition-colors"
                    >
                        {action.icon}
                        {action.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ContextualActionBar;
