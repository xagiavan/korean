
import React from 'react';

interface FeatureHeaderProps {
    title: string;
    description: string;
}

const FeatureHeader: React.FC<FeatureHeaderProps> = ({ title, description }) => {
    return (
        <div className="mb-6 pb-3 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-extrabold sm:text-3xl text-slate-800 dark:text-white mb-2">{title}</h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">{description}</p>
        </div>
    );
};

export default FeatureHeader;