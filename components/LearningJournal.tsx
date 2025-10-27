import React, { useState, useEffect, useCallback } from 'react';
import FeatureHeader from './FeatureHeader';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import * as journalService from '../services/journalService';
import * as gamificationService from '../services/gamificationService';
import type { JournalAnalysis } from '../types';
import Loader from './Loader';
import { SparklesIcon, StarIcon, FlagIcon } from './icons/Icons';
import UpgradeToVipPrompt from './UpgradeToVipPrompt';

type JournalStatus = 'none' | 'important' | 'review';

const LearningJournal: React.FC = () => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const [content, setContent] = useState('');
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [analysisResult, setAnalysisResult] = useState<JournalAnalysis | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [status, setStatus] = useState<JournalStatus>('none');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadJournal = async () => {
            if (!currentUser?.email) return;
            setIsLoading(true);
            const savedData = await journalService.loadJournalEntry();
            setContent(savedData.content);
            setLastSaved(savedData.timestamp ? new Date(savedData.timestamp) : null);
            setStatus(savedData.status);
            setIsLoading(false);
        };
        loadJournal();
    }, [currentUser]);

    const handleSave = useCallback(async () => {
        if (!currentUser?.email) return;
        try {
            const savedEntry = await journalService.saveJournalEntry(content, status);
            setLastSaved(savedEntry.timestamp ? new Date(savedEntry.timestamp) : null);
            addToast({
                type: 'success',
                title: 'Đã lưu!',
                message: 'Nhật ký của bạn đã được lưu thành công.'
            });
        } catch (error) {
            console.error("Failed to save journal:", error);
            addToast({
                type: 'error',
                title: 'Lỗi',
                message: 'Không thể lưu nhật ký của bạn.'
            });
        }
    }, [content, status, addToast, currentUser]);
    
    const handleSetStatus = (newStatus: 'important' | 'review') => {
        setStatus(currentStatus => currentStatus === newStatus ? 'none' : newStatus);
    };

    const formatLastSaved = (date: Date | null) => {
        if (!date) return 'Chưa được lưu.';
        return `Lần cuối lưu vào: ${date.toLocaleTimeString()} ${date.toLocaleDateString()}`;
    };

    const handleAnalyze = async () => {
        if (!content.trim()) {
            addToast({ type: 'warning', title: 'Nhật ký trống', message: 'Vui lòng viết gì đó trước khi phân tích.'});
            return;
        }
        if (!currentUser?.isVip || !currentUser?.email) {
            setAnalysisResult(await journalService.analyzeJournalEntryWithGemini("")); // Use sample data
            return;
        }
        setIsAnalyzing(true);
        setAnalysisResult(null);
        try {
            const result = await journalService.analyzeJournalEntryWithGemini(content);
            setAnalysisResult(result);
            if (result) {
                await gamificationService.addXp(20);
            }
        } catch (error) {
            console.error(error);
            addToast({ type: 'error', title: 'Lỗi', message: 'Không thể phân tích nhật ký của bạn.'});
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (isLoading) {
        return <div className="min-h-[50vh] flex items-center justify-center"><Loader /></div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <FeatureHeader
                title="Nhật ký Học tập"
                description="Ghi lại những gì bạn đã học, những khó khăn và tiến bộ của bạn mỗi ngày."
            />
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Hãy thử viết một đoạn nhật ký bằng tiếng Hàn...&#10;Ví dụ: 오늘 날씨가 아주 좋아서 친구하고 공원에 갔어요. 우리는 같이 자전거를 타고 맛있는 떡볶이를 먹었어요. 정말 재미있었어요."
                    className="w-full h-48 sm:h-64 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-md resize-y focus:ring-2 focus:ring-hanguk-blue-500 focus:border-hanguk-blue-500 transition-colors"
                />
                <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <span className="text-sm text-slate-500 dark:text-slate-400 order-last sm:order-first">
                        {formatLastSaved(lastSaved)}
                    </span>
                    <div className="flex gap-2 items-center">
                         <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-700 rounded-lg">
                            <button
                                onClick={() => handleSetStatus('important')}
                                title="Đánh dấu là quan trọng"
                                className={`p-2 rounded-md transition-colors ${status === 'important' ? 'bg-yellow-100 text-yellow-500 dark:bg-yellow-800 dark:text-yellow-300' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                            >
                                <StarIcon className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleSetStatus('review')}
                                title="Đánh dấu cần xem lại"
                                className={`p-2 rounded-md transition-colors ${status === 'review' ? 'bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-300' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                            >
                                <FlagIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="w-px h-8 bg-slate-200 dark:bg-slate-600"></div>
                        <button
                            onClick={handleSave}
                            disabled={isAnalyzing}
                            className="px-6 py-2 bg-slate-200 dark:bg-slate-600 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                        >
                            Lưu
                        </button>
                         <button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing}
                            className="px-6 py-2 bg-hanguk-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-hanguk-blue-700 disabled:bg-slate-400 flex items-center gap-2"
                        >
                            {isAnalyzing ? <><Loader /> Đang phân tích...</> : <><SparklesIcon small /> Phân tích với AI</>}
                        </button>
                    </div>
                </div>
            </div>

            {isAnalyzing && (
                 <div className="mt-6 flex flex-col items-center justify-center">
                    <Loader />
                    <p className="mt-2 text-slate-500 dark:text-slate-400">Gia sư AI đang đọc bài của bạn...</p>
                </div>
            )}

            {analysisResult && (
                <div className="mt-6 space-y-6 animate-fade-in-up">
                    {!currentUser?.isVip && <UpgradeToVipPrompt featureName="phân tích chi tiết bằng AI" setActiveFeature={() => {}} isSampleData={true} />}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-bold mb-3 text-green-600 dark:text-green-400">Văn bản đã sửa</h3>
                        <p className="p-4 bg-green-50 dark:bg-green-900/50 rounded-md whitespace-pre-wrap">{analysisResult.correctedText}</p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-bold mb-3 text-orange-600 dark:text-orange-400">Sửa lỗi & Giải thích</h3>
                        <ul className="space-y-3">
                            {(analysisResult.corrections || []).map((corr, index) => (
                                <li key={index} className="p-3 bg-orange-50 dark:bg-orange-900/50 rounded-md">
                                    <p><span className="font-semibold line-through text-red-500">{corr.original}</span> → <span className="font-semibold text-green-600">{corr.corrected}</span></p>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{corr.explanation}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                     <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-bold mb-3 text-blue-600 dark:text-blue-400">Gợi ý Văn phong</h3>
                        <p className="p-4 bg-blue-50 dark:bg-blue-900/50 rounded-md">{analysisResult.suggestion}</p>
                    </div>
                </div>
            )}

        </div>
    );
};

export default LearningJournal;