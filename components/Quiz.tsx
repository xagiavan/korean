

import React, { useState, useCallback, useEffect } from 'react';
import { generateQuiz, generatePersonalizedQuiz, sampleQuiz } from '../services/geminiService';
import type { QuizQuestion, AppFeatureProps, Badge } from '../types';
import Loader from './Loader';
import FeatureHeader from './FeatureHeader';
import { useAuth } from '../contexts/AuthContext';
import UpgradeToVipPrompt from './UpgradeToVipPrompt';
import * as errorTrackingService from '../services/errorTrackingService';
import * as statsService from '../services/statsService';
import * as gamificationService from '../services/gamificationService';
import { useToast } from '../contexts/ToastContext';
import { SparklesIcon, AcademicCapIcon, CheckCircleIcon, XCircleIcon } from './icons/Icons';


const TOPIK_LEVELS = ['1', '2', '3', '4', '5', '6'];

const DIFFICULTIES: Record<'beginner' | 'intermediate' | 'advanced', string> = { beginner: 'Sơ cấp', intermediate: 'Trung cấp', advanced: 'Cao cấp' };

const Quiz: React.FC<AppFeatureProps> = ({ setActiveFeature }) => {
    const { currentUser } = useAuth();
    const { addToast, showBadgeCelebration } = useToast();
    const [level, setLevel] = useState('1');
    const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isQuizFinished, setIsQuizFinished] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [quizType, setQuizType] = useState<'topik' | 'personalized'>('topik');
    
    const startQuiz = useCallback(async (selectedLevel: string, selectedDifficulty: 'beginner' | 'intermediate' | 'advanced') => {
        setIsLoading(true);
        setIsQuizFinished(false);
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setApiError(null);
        setQuizType('topik');

        let data;
        if (currentUser?.isVip) {
            const response = await generateQuiz(selectedLevel, 'vocabulary', selectedDifficulty);
            data = response.questions;
            if (!response.isSuccess) {
                setApiError(response.errorMessage || 'Đã xảy ra lỗi không xác định.');
            }
        } else {
            data = sampleQuiz;
        }
        setQuestions(data);
        setIsLoading(false);
    }, [currentUser]);

    const startPersonalizedQuiz = useCallback(async () => {
        if (!currentUser?.isVip || !currentUser?.email) {
            addToast({ type: 'warning', title: 'Tính năng VIP', message: 'Trắc nghiệm cá nhân hóa là tính năng VIP.' });
            return;
        }

        const commonErrors = await errorTrackingService.getCommonErrors(3);
        if (commonErrors.grammar.length === 0 && commonErrors.vocab.length === 0) {
            addToast({ type: 'info', title: 'Tuyệt vời!', message: 'Hệ thống chưa ghi nhận lỗi sai nào của bạn để tạo bài ôn tập. Hãy thử làm một bài trắc nghiệm TOPIK nhé!' });
            return;
        }

        setIsLoading(true);
        setIsQuizFinished(false);
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setApiError(null);
        setQuizType('personalized');

        const response = await generatePersonalizedQuiz(commonErrors);
        if (response.isSuccess && response.questions.length > 0) {
            setQuestions(response.questions);
        } else {
            setApiError(response.errorMessage || 'Không thể tạo bài trắc nghiệm cá nhân hóa vào lúc này.');
            setQuestions([]); // Reset questions on error
        }
        setIsLoading(false);
    }, [currentUser, addToast]);

    const handleNextQuestion = useCallback(async () => {
        if (!currentUser?.email) return;

        // Ensure score is updated before finishing
        const isFinalAnswerCorrect = selectedAnswer === questions[currentQuestionIndex]?.answer;
        const finalScore = isAnswered ? score : (isFinalAnswerCorrect ? score + 1 : score);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(i => i + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else {
            setIsQuizFinished(true);
            const completionBadges = await gamificationService.recordQuizCompletion();
            const scorePercent = (finalScore / questions.length) * 100;
            const scoreBadges = await gamificationService.checkQuizBadges(scorePercent);
            showBadgeCelebration([...completionBadges, ...scoreBadges]);
        }
    }, [currentQuestionIndex, questions.length, currentUser, selectedAnswer, isAnswered, score, showBadgeCelebration]);


    const handleAnswerSubmit = async () => {
        if (!selectedAnswer || !currentUser?.email) return;
        
        await statsService.incrementTestStat();
        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = selectedAnswer === currentQuestion.answer;
        
        setIsAnswered(true);

        if (isCorrect) {
            setScore(s => s + 1);
            const { newBadges } = await gamificationService.addXp(20);
            showBadgeCelebration(newBadges);
            addToast({
                type: 'success',
                title: 'Chính xác!',
                message: 'Tuyệt vời!'
            });
            setTimeout(() => {
                handleNextQuestion();
            }, 1200);
        } else {
            // Track error
            if (currentQuestion.topic.toLowerCase().includes('grammar')) {
                await errorTrackingService.addGrammarError(currentQuestion.topic);
            } else if (currentQuestion.correctWord) {
                 await errorTrackingService.addVocabError(currentQuestion.correctWord);
            }
        }
    };
    
    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><Loader /></div>;
    }
    
    if (questions.length === 0 || isQuizFinished) {
        return (
             <div className="max-w-2xl mx-auto text-center">
                 <FeatureHeader title="Trắc nghiệm" description="Kiểm tra kiến thức của bạn với các câu hỏi trắc nghiệm đa dạng." />
                
                {isQuizFinished && (
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md mb-6 animate-fade-in">
                        <h3 className="text-2xl font-bold">Hoàn thành!</h3>
                        <p className="text-3xl sm:text-4xl font-bold my-4">{score} / {questions.length}</p>
                    </div>
                )}

                {apiError && (
                    <div className="my-4 p-4 bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-300 rounded-r-lg">
                        <p className="font-bold">Thông báo</p>
                        <p className="text-sm">{apiError}</p>
                    </div>
                )}

                 <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md space-y-6">
                    {/* Personalized Quiz Section */}
                    <div>
                        <h3 className="text-lg font-bold mb-2">Ôn tập Thông minh</h3>
                        <button 
                            onClick={startPersonalizedQuiz} 
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-hanguk-blue-600 to-cyan-500 text-white font-bold rounded-lg shadow-md hover:opacity-90 transition-opacity"
                        >
                            <SparklesIcon /> Tạo Bài ôn tập Điểm yếu (AI)
                        </button>
                         {!currentUser?.isVip && <p className="text-xs text-slate-500 mt-2">Tính năng VIP</p>}
                    </div>

                    {/* TOPIK Quiz Section */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-slate-300 dark:border-slate-600" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-white dark:bg-slate-800 px-2 text-sm text-slate-500">HOẶC</span>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-3">Chọn Trình độ Câu hỏi</h3>
                        <div className="flex flex-wrap gap-1 p-1 bg-slate-200 dark:bg-slate-700 rounded-lg mb-4 justify-center">
                            {Object.entries(DIFFICULTIES).map(([key, value]) => (
                                <button key={key} onClick={() => setDifficulty(key as any)} className={`px-4 py-1.5 rounded-md font-semibold text-sm transition-colors ${difficulty === key ? 'bg-white dark:bg-slate-800 text-hanguk-blue-600 shadow' : 'text-slate-600 dark:text-slate-300'}`}>
                                    {value}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-3">Luyện theo cấp độ TOPIK</h3>
                        <div className="flex flex-wrap gap-1 p-1 bg-slate-200 dark:bg-slate-700 rounded-lg mb-4 justify-center">
                            {TOPIK_LEVELS.map(l => (
                                <button key={l} onClick={() => setLevel(l)} className={`px-4 py-1.5 rounded-md font-semibold text-sm transition-colors ${level === l ? 'bg-white dark:bg-slate-800 text-hanguk-blue-600 shadow' : 'text-slate-600 dark:text-slate-300'}`}>
                                    Cấp {l}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => startQuiz(level, difficulty)} className="w-full px-6 py-3 bg-hanguk-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-hanguk-blue-700">
                            {isQuizFinished ? 'Bắt đầu bài TOPIK mới' : 'Bắt đầu'}
                        </button>
                         {!currentUser?.isVip && !isQuizFinished && <UpgradeToVipPrompt featureName="tạo đề trắc nghiệm không giới hạn" setActiveFeature={setActiveFeature as any} isSampleData={true} />}
                    </div>
                </div>
            </div>
        );
    }
    
    const currentQuestion = questions[currentQuestionIndex];
    const quizTitle = quizType === 'personalized' 
        ? 'Trắc nghiệm Ôn tập Cá nhân hóa' 
        : `Trắc nghiệm - Cấp ${level} (Độ khó: ${DIFFICULTIES[difficulty]})`;

    const progressPercentage = (currentQuestionIndex / questions.length) * 100;

    return (
        <div className="max-w-2xl mx-auto">
             <FeatureHeader title={quizTitle} description={`Câu ${currentQuestionIndex + 1} / ${questions.length}`} />
             
             {/* Progress Bar */}
             <div className="mb-4">
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div className="bg-hanguk-blue-600 h-2 rounded-full transition-all duration-300 ease-out" style={{ width: `${progressPercentage}%` }}></div>
                </div>
             </div>

             <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                <p className="font-semibold text-sm text-slate-500">{currentQuestion.topic}</p>
                <h3 className="text-lg md:text-xl font-bold my-4 min-h-[56px] flex items-center">{currentQuestion.question}</h3>
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
                                buttonClass += "border-slate-300 dark:border-slate-600 opacity-60 cursor-not-allowed";
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
                        {selectedAnswer !== currentQuestion.answer && currentQuestion.topic.toLowerCase().includes('grammar') && (
                            <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                                <button 
                                    onClick={() => setActiveFeature('grammarCurriculum', { searchTerm: currentQuestion.topic.replace(/Grammar:\s*/i, '') })}
                                    className="flex items-center gap-1 text-sm font-bold text-hanguk-blue-600 dark:text-hanguk-blue-400 hover:underline"
                                    title={`Tìm hiểu thêm về: ${currentQuestion.topic.replace(/Grammar:\s*/i, '')}`}
                                >
                                    <AcademicCapIcon small />
                                    Ôn tập chủ đề này
                                </button>
                            </div>
                        )}
                    </div>
                )}
                
                <div className="mt-6 text-right">
                    {isAnswered ? (
                        <button onClick={handleNextQuestion} className="px-6 py-2 bg-hanguk-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-hanguk-blue-700">
                            {currentQuestionIndex < questions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}
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

export default Quiz;