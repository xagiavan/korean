import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { AppFeatureProps, LearningHistoryItem, VocabItem, Phrase, GrammarPoint } from '../types';
import * as learningHistoryService from '../services/learningHistoryService';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import FeatureHeader from './FeatureHeader';
import { DictionaryIcon, ListBulletIcon, AcademicCapIcon, HistoryIcon, PlanIcon } from './icons/Icons';
import Loader from './Loader';

// Nhóm lịch sử theo ngày (Hôm nay, Hôm qua, Ngày khác)
const groupHistoryByDate = (history: LearningHistoryItem[]) => {
    const grouped: Record<string, LearningHistoryItem[]> = {};
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const todayStr = today.toLocaleDateString('vi-VN');
    const yesterdayStr = yesterday.toLocaleDateString('vi-VN');

    history.forEach(item => {
        const itemDate = new Date(item.id);
        const itemDateStr = itemDate.toLocaleDateString('vi-VN');
        let key: string;

        if (itemDateStr === todayStr) {
            key = 'Hôm nay';
        } else if (itemDateStr === yesterdayStr) {
            key = 'Hôm qua';
        } else {
            key = itemDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
        }

        if (!grouped[key]) {
            grouped[key] = [];
        }
        grouped[key].push(item);
    });

    return grouped;
};

// Format time to be relative for today, and absolute for older entries
const formatTime = (isoString: string, dateGroup: string) => {
    const itemDate = new Date(isoString);
    if (dateGroup === 'Hôm nay') {
        const now = new Date();
        const diffInSeconds = Math.round((now.getTime() - itemDate.getTime()) / 1000);

        if (diffInSeconds < 60) return "vài giây trước";
        const diffInMinutes = Math.round(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
        const diffInHours = Math.round(diffInMinutes / 60);
        return `${diffInHours} giờ trước`;
    }
    return itemDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

// Component hiển thị một mục trong lịch sử
const HistoryItemCard: React.FC<{ item: LearningHistoryItem, setActiveFeature: AppFeatureProps['setActiveFeature'], dateGroup: string }> = ({ item, setActiveFeature, dateGroup }) => {
    const { type, content } = item;
    
    const getIcon = () => {
        switch(type) {
            case 'vocab': return <DictionaryIcon className="w-5 h-5 text-hanguk-blue-600 dark:text-hanguk-blue-400" />;
            case 'phrase': return <ListBulletIcon className="w-5 h-5 text-green-600 dark:text-green-400" />;
            case 'grammar': return <AcademicCapIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
            default: return null;
        }
    };
    
    const handleClick = () => {
        switch(type) {
            case 'vocab':
                setActiveFeature('dictionary', { word: (content as VocabItem).word });
                break;
            case 'phrase':
                 setActiveFeature('phrases', { searchTerm: (content as Phrase).korean });
                break;
            case 'grammar':
                setActiveFeature('grammarCurriculum', { searchTerm: (content as GrammarPoint).pattern });
                break;
        }
    };

    const renderContent = () => {
        switch(type) {
            case 'vocab':
                const vocab = content as VocabItem;
                return (
                    <div>
                        <p className="font-bold">{vocab.word}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{vocab.meaning}</p>
                    </div>
                );
            case 'phrase':
                 const phrase = content as Phrase;
                return (
                    <div>
                        <p className="font-bold">{phrase.korean}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">"{phrase.vietnamese}"</p>
                    </div>
                );
            case 'grammar':
                const grammar = content as GrammarPoint;
                return (
                    <div>
                        <p className="font-bold">{grammar.pattern}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{grammar.meaning}</p>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <button onClick={handleClick} className="w-full flex items-center gap-4 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left">
            <div className="flex-shrink-0">
                {getIcon()}
            </div>
            <div className="flex-grow">
                {renderContent()}
            </div>
            <span className="text-xs text-slate-400 self-start">{formatTime(item.id, dateGroup)}</span>
        </button>
    );
};


const LearningHistory: React.FC<AppFeatureProps> = ({ setActiveFeature }) => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const [history, setHistory] = useState<LearningHistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadHistory = useCallback(async () => {
        if (currentUser?.email) {
            setIsLoading(true);
            const historyData = await learningHistoryService.getHistory();
            setHistory(historyData);
            setIsLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    const groupedHistory = useMemo(() => groupHistoryByDate(history), [history]);

    const handleClearHistory = async () => {
        if (!currentUser?.email) return;
        if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử học tập không?')) {
            await learningHistoryService.deleteUserHistory();
            setHistory([]);
            addToast({ type: 'success', title: 'Hoàn tất', message: 'Lịch sử học tập của bạn đã được xóa.' });
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <FeatureHeader
                title="Lịch sử học tập"
                description="Xem lại những từ vựng, cụm từ và ngữ pháp bạn đã học gần đây."
            />
            
             {history.length > 0 && (
                <div className="text-right mb-4">
                    <button
                        onClick={handleClearHistory}
                        className="text-sm font-semibold text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                    >
                        Xóa tất cả
                    </button>
                </div>
            )}

            {isLoading ? <div className="flex justify-center mt-8"><Loader /></div> : history.length === 0 ? (
                <div className="text-center py-16 px-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg flex flex-col items-center">
                    <div className="p-5 bg-slate-100 dark:bg-slate-700/50 rounded-full mb-4">
                        <HistoryIcon className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Chưa có hoạt động nào</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
                        Khi bạn tra từ, học ngữ pháp, hoặc tạo hội thoại, các hoạt động đó sẽ được ghi lại ở đây để bạn dễ dàng xem lại.
                    </p>
                    <button onClick={() => setActiveFeature('plan')} className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-hanguk-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-hanguk-blue-700 transition-colors">
                        <PlanIcon small /> Xem bảng điều khiển
                    </button>
                </div>
            ) : (
                <div className="space-y-8">
                    {Object.keys(groupedHistory).map((date) => (
                        <div key={date}>
                            <h3 className="font-bold text-lg mb-3 pb-2 border-b border-slate-200 dark:border-slate-700">{date}</h3>
                            <div className="space-y-3">
                                {groupedHistory[date].map(item => (
                                    <HistoryItemCard key={item.id} item={item} setActiveFeature={setActiveFeature} dateGroup={date} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LearningHistory;