import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { grammarQuizData, type GrammarQuizCategory } from '../services/grammarQuizData';
import type { QuizQuestion } from '../types';
import FeatureHeader from './FeatureHeader';
import * as gamificationService from '../services/gamificationService';
import { TrophyIcon, CheckCircleIcon, XCircleIcon } from './icons/Icons';
import { useAuth } from '../contexts/AuthContext';
import * as geminiService from '../services/geminiService';
import Loader from './Loader';
import UpgradeToVipPrompt from './UpgradeToVipPrompt';
import { useToast } from '../contexts/ToastContext';

type Level = 'beginner' | 'intermediate';
type Feature = 'upgrade';

interface GrammarQuizProps {
    setActiveFeature: (feature: Feature) => void;
}


const GrammarQuiz: React.FC<GrammarQuizProps> = ({ setActiveFeature }) => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const [categories] = useState<GrammarQuizCategory[]>(grammarQuizData);
    const [activeQuiz, setActiveQuiz] = useState<QuizQuestion[] | null>(null);
    const [activeCategory, setActiveCategory] = useState<GrammarQuizCategory | null>(null);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [isQuizFinished, setIsQuizFinished] = useState(false);
    const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
    
    // State for level filtering and pagination
    const [activeLevel, setActiveLevel] = useState<Level>('beginner');
    const [currentPage, setCurrentPage] = useState(1);
    const [stats, setStats] = useState({ attemptedCount: 0, totalTakenCount: 0 });
    const [attemptedIds, setAttemptedIds] = useState<string[]>([]);
    const [isLoadingStats, setIsLoadingStats] = useState(true);

    const loadStats = useCallback(async () => {
        if (!currentUser?.email) return;
        setIsLoadingStats(true);
        const [summary, ids] = await Promise.all([
            gamificationService.getGrammarQuizSummary(),
            gamificationService.getAttemptedGrammarQuizIds()
        ]);
        setStats(summary);
        setAttemptedIds(ids);
        setIsLoadingStats(false);
    }, [currentUser]);
    
    useEffect(() => {
        loadStats();
    }, [loadStats]);

    const startQuiz = useCallback(async (category: GrammarQuizCategory) => {
        if (!currentUser) return;

        setIsGeneratingQuiz(true);
        setActiveQuiz(null); 
        setActiveCategory(category);
        setIsQuizFinished(false);
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsAnswered(false);

        try {
            const topikLevel = activeLevel === 'beginner' ? '2' : '4';
            let data: QuizQuestion[];

            if (currentUser.isVip) {
                const response = await geminiService.generateQuiz(topikLevel, category.name);
                if (response.isSuccess && response.questions.length > 0) {
                    data = response.questions;
                } else {
                    const errorMessage = response.errorMessage || 'Không thể tạo câu hỏi. Vui lòng thử lại.';
                    addToast({ type: 'error', title: 'Lỗi', message: errorMessage });
                    setIsGeneratingQuiz(false);
                    setActiveCategory(null);
                    return;
                }
            } else {
                data = category.questions.slice(0, 5);
            }
            
            const shuffledQuestions = [...data].sort(() => Math.random() - 0.5);
            setActiveQuiz(shuffledQuestions);

        } catch (error) {
            console.error("Error starting quiz:", error);
            addToast({ type: 'error', title: 'Lỗi', message: 'Không thể bắt đầu bài trắc nghiệm.' });
            setActiveCategory(null);
        } finally {
            setIsGeneratingQuiz(false);
        }
    }, [activeLevel, currentUser, addToast]);

    const handleNextQuestion = async () => {
        if (!activeQuiz || !activeCategory) return;

        if (currentQuestionIndex < activeQuiz.length - 1) {
            setCurrentQuestionIndex(i => i + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else {
            setIsQuizFinished(true);
            await gamificationService.recordQuizCompletion();
            await gamificationService.recordGrammarQuizAttempt(activeCategory.id);
            
            const finalScore = score + (selectedAnswer === activeQuiz[currentQuestionIndex].answer ? 1 : 0);
            const scorePercent = (finalScore / activeQuiz.length) * 100;
            await gamificationService.checkQuizBadges(scorePercent);
        }
    };

    const handleAnswerSubmit = async () => {
        if (!selectedAnswer || !activeQuiz) return;
        
        const currentQuestion = activeQuiz[currentQuestionIndex];
        const isCorrect = selectedAnswer === currentQuestion.answer;
        
        if (isCorrect) {
            setScore(s => s + 1);
            await gamificationService.addXp(15);
            addToast({
                type: 'success',
                title: 'Chính xác!',
                message: `Câu trả lời đúng là "${currentQuestion.answer}".`
            });
            handleNextQuestion();
        } else {
            setIsAnswered(true);
        }
    };
    
    const resetToCategorySelection = useCallback(() => {
        setActiveQuiz(null);
        setActiveCategory(null);
        setIsQuizFinished(false);
        loadStats();
    }, [loadStats]);
    
    const handleLevelChange = (level: Level) => {
        setActiveLevel(level);
        setCurrentPage(1);
    }

    if (!activeQuiz) {
        const ITEMS_PER_PAGE = 12;
        const filteredCategories = useMemo(() => categories.filter(c => c.level === activeLevel), [categories, activeLevel]);
        const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const currentCategories = filteredCategories.slice(startIndex, endIndex);

        return (
            <div className="max-w-4xl mx-auto">
                <FeatureHeader
                    title="Trắc nghiệm Ngữ pháp"
                    description="Kiểm tra kiến thức ngữ pháp của bạn qua các chủ đề được phân theo cấp độ."
                />

                {isGeneratingQuiz ? (
                    <div className="flex flex-col items-center justify-center min-h-[40vh]">
                        <Loader />
                        <p className="mt-4 text-slate-500 dark:text-slate-400">Gia sư AI đang tạo bài trắc nghiệm về "{activeCategory?.name}" cho bạn...</p>
                    </div>
                ) : (
                    <>
                        {!currentUser?.isVip && (
                            <UpgradeToVipPrompt 
                                featureName="tạo đề trắc nghiệm không giới hạn bằng AI" 
                                setActiveFeature={setActiveFeature} 
                                isSampleData={true} 
                            />
                        )}

                        <div className="mb-6 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
                            <h3 className="font-bold text-lg mb-3 text-slate-700 dark:text-slate-200">Thống kê của bạn</h3>
                            {isLoadingStats ? <Loader /> :
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                                <div className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                                    <p className="text-3xl font-bold text-hanguk-blue-600 dark:text-hanguk-blue-400">
                                        {stats.attemptedCount} <span className="text-lg text-slate-500">/ {categories.length}</span>
                                    </p>
                                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Chủ đề đã thử</p>
                                </div>
                                <div className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                                    <p className="text-3xl font-bold text-hanguk-blue-600 dark:text-hanguk-blue-400">
                                        {stats.totalTakenCount}
                                    </p>
                                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Tổng số lần làm bài</p>
                                </div>
                            </div>}
                        </div>

                        <div className="mb-6 border-b-2 border-slate-200 dark:border-slate-700">
                            <button onClick={() => handleLevelChange('beginner')} className={`px-4 py-2 font-semibold text-sm transition-colors ${activeLevel === 'beginner' ? 'border-b-2 border-hanguk-blue-600 text-hanguk-blue-600 dark:text-hanguk-blue-300' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}>
                                Sơ cấp
                            </button>
                            <button onClick={() => handleLevelChange('intermediate')} className={`px-4 py-2 font-semibold text-sm transition-colors ${activeLevel === 'intermediate' ? 'border-b-2 border-hanguk-blue-600 text-hanguk-blue-600 dark:text-hanguk-blue-300' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}>
                                Trung cấp
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {currentCategories.map((cat, index) => (
                                <div
                                    key={cat.id}
                                    className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md flex flex-col group transition-all-base hover:shadow-xl hover:-translate-y-1 animate-fade-in-up"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-lg text-hanguk-blue-800 dark:text-hanguk-blue-300 transition-colors group-hover:text-hanguk-blue-700 dark:group-hover:text-hanguk-blue-200 pr-2">{cat.name}</h3>
                                        {attemptedIds.includes(cat.id) && (
                                            <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" title="Đã hoàn thành" />
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 flex-grow my-2">{cat.description}</p>
                                    <button onClick={() => startQuiz(cat)} className="mt-4 w-full px-4 py-2 bg-hanguk-blue-600 text-white font-semibold rounded-lg hover:bg-hanguk-blue-700 transition-colors">
                                        {currentUser?.isVip ? (attemptedIds.includes(cat.id) ? 'Làm lại' : 'Bắt đầu') : 'Làm bài mẫu'}
                                    </button>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-8 flex justify-center items-center gap-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                                    <button
                                        key={pageNumber}
                                        onClick={() => setCurrentPage(pageNumber)}
                                        className={`w-10 h-10 rounded-md font-semibold text-sm transition-colors ${
                                            currentPage === pageNumber
                                                ? 'bg-hanguk-blue-600 text-white shadow'
                                                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600'
                                        }`}
                                    >
                                        {pageNumber}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    }
    
    if (isQuizFinished) {
        return (
             <div className="max-w-2xl mx-auto text-center">
                 <FeatureHeader title="Kết quả Trắc nghiệm" description={activeCategory?.name || ''} />
                 <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md mb-6 animate-fade-in flex flex-col items-center">
                    <TrophyIcon className="w-16 h-16 text-yellow-500 mb-4" />
                    <h3 className="text-2xl font-bold">Hoàn thành!</h3>
                    <p className="text-4xl font-bold my-4 text-hanguk-blue-700 dark:text-hanguk-blue-300">{score} / {activeQuiz.length}</p>
                    <div className="flex gap-4">
                        <button onClick={() => activeCategory && startQuiz(activeCategory)} className="px-6 py-2 bg-hanguk-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-hanguk-blue-700">
                            Làm lại
                        </button>
                        <button onClick={resetToCategorySelection} className="px-6 py-2 bg-slate-200 dark:bg-slate-600 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700">
                            Chọn chủ đề khác
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    const currentQuestion = activeQuiz[currentQuestionIndex];

    return (
        <div className="max-w-2xl mx-auto">
             <FeatureHeader title={activeCategory?.name || 'Trắc nghiệm Ngữ pháp'} description={`Câu ${currentQuestionIndex + 1} / ${activeQuiz.length}`} />
             <div key={currentQuestionIndex} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md animate-fade-in-up">
                <h3 className="text-xl font-bold my-4">{currentQuestion.question}</h3>
                <div className="space-y-3">
                    {(currentQuestion.options || []).map(option => {
                        const isCorrect = option === currentQuestion.answer;
                        const isSelected = option === selectedAnswer;
                        
                        let buttonClass = "w-full p-3 text-left border-2 rounded-lg transition-colors font-semibold flex justify-between items-center ";
                        let icon = null;

                        if (isAnswered) {
                            if (isCorrect) {
                                buttonClass += "bg-green-100 border-green-500 text-green-800 dark:bg-green-900/50 dark:border-green-700 dark:text-green-300";
                                icon = <CheckCircleIcon className="w-5 h-5 text-green-600" />;
                            } else if (isSelected) {
                                buttonClass += "bg-red-100 border-red-500 text-red-800 dark:bg-red-900/50 dark:border-red-700 dark:text-red-300";
                                icon = <XCircleIcon className="w-5 h-5 text-red-600" />;
                            } else {
                                buttonClass += "border-slate-300 dark:border-slate-600 opacity-50 cursor-not-allowed";
                            }
                        } else {
                            buttonClass += isSelected 
                                ? "bg-hanguk-blue-100 border-hanguk-blue-500 dark:bg-hanguk-blue-900/70 dark:border-hanguk-blue-600" 
                                : "bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600";
                        }

                        return (
                            <button key={option} onClick={() => !isAnswered && setSelectedAnswer(option)} disabled={isAnswered} className={buttonClass}>
                                <span>{option}</span>
                                {icon}
                            </button>
                        );
                    })}
                </div>

                {isAnswered && (
                    <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-900/50 rounded-lg animate-fade-in-up">
                        <p className="font-semibold text-sm">{selectedAnswer === currentQuestion.answer ? "Chính xác!" : "Chưa đúng."}</p>
                        <p className="text-sm">{currentQuestion.explanation}</p>
                    </div>
                )}
                
                <div className="mt-6 text-right">
                    {isAnswered ? (
                        <button onClick={handleNextQuestion} className="px-6 py-2 bg-hanguk-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-hanguk-blue-700">
                            {currentQuestionIndex < activeQuiz.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}
                        </button>
                    ) : (
                        <button onClick={handleAnswerSubmit} disabled={!selectedAnswer} className="px-6 py-2 bg-slate-600 text-white font-bold rounded-lg shadow-md hover:bg-slate-700 disabled:bg-slate-400">
                            Trả lời
                        </button>
                    )}
                </div>
             </div>
        </div>
    );
};

export default GrammarQuiz;
