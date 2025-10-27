import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { grammarReferenceData } from '../services/grammarReferenceData';
import * as geminiService from '../services/geminiService';
import * as learningHistoryService from '../services/learningHistoryService';
import type { GrammarLevel, GrammarPoint, VocabItem, AppFeatureProps, QuizQuestion } from '../types';
import FeatureHeader from './FeatureHeader';
import { SpeakerIcon, PlusIcon, SparklesIcon, CheckCircleIcon, LightbulbIcon, CheckIcon, XCircleIcon, ClipboardDocumentIcon } from './icons/Icons';
import { speak } from '../services/ttsService';
import * as srsService from '../services/srsService';
import * as gamificationService from '../services/gamificationService';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import Loader from './Loader';
import * as statsService from '../services/statsService';
import { apiClient } from '../services/apiClient';

const GRAMMAR_PROGRESS_API = '/api/data/grammar-progress';

interface MiniQuizState {
    questions: QuizQuestion[] | null;
    isLoading: boolean;
    error: string | null;
    currentQuestionIndex: number;
    userAnswer: string | null;
    isAnswered: boolean;
}

const GrammarReference: React.FC<AppFeatureProps> = ({ setActiveFeature, payload }) => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const [data] = useState<GrammarLevel[]>(grammarReferenceData);
    const [activeLevel, setActiveLevel] = useState<GrammarLevel['levelId']>('beginner');
    const [searchTerm, setSearchTerm] = useState('');
    const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());
    const [openLesson, setOpenLesson] = useState<string | null>(null);
    const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
    const [quizStates, setQuizStates] = useState<Record<string, MiniQuizState>>({});
    const [isLoadingProgress, setIsLoadingProgress] = useState(true);

    const getStoredProgress = useCallback(async () => {
        if (!currentUser?.email) return new Set<string>();
        try {
            const progressArray = await apiClient.get<string[]>(GRAMMAR_PROGRESS_API);
            return new Set<string>(progressArray);
        } catch (e) {
            console.error("Failed to load grammar progress:", e);
            return new Set<string>();
        }
    }, [currentUser]);

    const saveStoredProgress = useCallback(async (progress: Set<string>) => {
        if (!currentUser?.email) return;
        try {
            await apiClient.post(GRAMMAR_PROGRESS_API, Array.from(progress));
        } catch (e) {
            console.error("Failed to save grammar progress:", e);
        }
    }, [currentUser]);

    useEffect(() => {
        const loadProgress = async () => {
            setIsLoadingProgress(true);
            const progress = await getStoredProgress();
            setCompletedLessons(progress);
            setIsLoadingProgress(false);
        };
        loadProgress();
    }, [currentUser, getStoredProgress]);

    const handleToggleLessonCompleted = useCallback(async (lessonPattern: string) => {
        const newProgress = new Set(completedLessons);
        if (newProgress.has(lessonPattern)) {
            newProgress.delete(lessonPattern);
        } else {
            newProgress.add(lessonPattern);
            const point = data.flatMap(level => level.categories).flatMap(category => category.points).find(p => p.pattern === lessonPattern);
            if(point && currentUser?.email) {
                await learningHistoryService.addHistoryItem('grammar', point);
                await gamificationService.addXp(10);
                addToast({ type: 'success', title: 'Đã hoàn thành!', message: `Bạn đã học xong ngữ pháp "${lessonPattern}".` });
            }
        }
        setCompletedLessons(newProgress);
        await saveStoredProgress(newProgress);
    }, [completedLessons, saveStoredProgress, currentUser, addToast, data]);

    useEffect(() => {
        if (payload?.searchTerm) {
            const term = payload.searchTerm;
            setSearchTerm(term);
            const lowercasedTerm = term.toLowerCase();

            for (const level of data) {
                for (const category of level.categories) {
                    const foundPoint = category.points.find(point =>
                        point.pattern.toLowerCase().includes(lowercasedTerm) ||
                        point.meaning.toLowerCase().includes(lowercasedTerm)
                    );
                    if (foundPoint) {
                        setActiveLevel(level.levelId);
                        setOpenCategories(prev => new Set(prev).add(category.categoryName));
                        setOpenLesson(foundPoint.pattern);
                        // Scroll to the element after a short delay to allow rendering
                        setTimeout(() => {
                            const element = document.getElementById(`lesson-${foundPoint.pattern}`);
                            element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 300);
                        return;
                    }
                }
            }
        }
    }, [payload, data]);
    
    const handleCopy = useCallback(async (textToCopy: string) => {
        if (!textToCopy) return;
        try {
            await navigator.clipboard.writeText(textToCopy);
            addToast({ type: 'success', title: 'Đã sao chép!', message: 'Văn bản đã được sao chép.' });
        } catch (err) {
            console.error('Failed to copy text: ', err);
            addToast({ type: 'error', title: 'Lỗi', message: 'Không thể sao chép văn bản.' });
        }
    }, [addToast]);

    const filteredCategories = useMemo(() => {
        const levelData = data.find(l => l.levelId === activeLevel);
        if (!levelData) return [];

        if (!searchTerm.trim()) {
            return levelData.categories;
        }

        const lowercasedTerm = searchTerm.toLowerCase();
        
        return levelData.categories.map(category => {
            const filteredPoints = category.points.filter(point => 
                point.pattern.toLowerCase().includes(lowercasedTerm) ||
                point.meaning.toLowerCase().includes(lowercasedTerm) ||
                point.explanation.toLowerCase().includes(lowercasedTerm)
            );
            return { ...category, points: filteredPoints };
        }).filter(category => category.points.length > 0);

    }, [data, activeLevel, searchTerm]);

    const handleToggleCategory = (categoryName: string) => {
        setOpenCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(categoryName)) {
                newSet.delete(categoryName);
            } else {
                newSet.add(categoryName);
            }
            return newSet;
        });
    };

    const handleAddToSrs = async (point: GrammarPoint) => {
        const vocabItem: VocabItem = {
            word: point.pattern,
            romanization: '',
            meaning: point.explanation.substring(0, 100) + '...',
            partOfSpeech: 'Ngữ pháp',
            example_sentence: point.examples[0]?.korean || '',
            example_translation: point.examples[0]?.vietnamese || '',
        };
        const count = await srsService.addWordsToDeck([vocabItem]);
        if (count > 0) {
            addToast({ type: 'success', title: 'Đã thêm!', message: `"${vocabItem.word}" đã được thêm vào bộ ôn tập.` });
            await gamificationService.addXp(5);
        } else {
            addToast({ type: 'info', title: 'Đã có', message: `"${vocabItem.word}" đã có trong bộ ôn tập của bạn.` });
        }
    };
    
    const handleGenerateQuiz = useCallback(async (point: GrammarPoint) => {
        const pattern = point.pattern;
        const baseState: MiniQuizState = { questions: null, isLoading: true, error: null, currentQuestionIndex: 0, userAnswer: null, isAnswered: false };
        setQuizStates(prev => ({ ...prev, [pattern]: baseState }));

        if (!currentUser?.isVip) {
            addToast({ type: 'warning', title: 'Tính năng VIP', message: 'Tạo trắc nghiệm nhanh là tính năng VIP. Đây là câu hỏi mẫu.' });
            setQuizStates(prev => ({ ...prev, [pattern]: { ...baseState, questions: geminiService.sampleGrammarPointQuiz, isLoading: false } }));
            return;
        }
        
        const response = await geminiService.generateGrammarPointQuiz(pattern, point.explanation);
        if (response.isSuccess) {
            setQuizStates(prev => ({ ...prev, [pattern]: { ...baseState, questions: response.questions, isLoading: false } }));
            await gamificationService.addXp(5);
        } else {
            setQuizStates(prev => ({ ...prev, [pattern]: { ...baseState, error: response.errorMessage, isLoading: false } }));
        }
    }, [currentUser, addToast]);

    const handleQuizAnswer = async (pattern: string, answer: string) => {
        setQuizStates(prev => {
            const currentState = prev[pattern];
            if (!currentState || !currentState.questions) return prev;
            
            const isCorrect = answer === currentState.questions[currentState.currentQuestionIndex].answer;
            if (isCorrect) {
                gamificationService.addXp(5);
            }
            return {
                ...prev,
                [pattern]: { ...currentState, userAnswer: answer, isAnswered: true }
            };
        });
    };

    const handleSpeak = async (text: string) => {
        speak(text);
        await statsService.incrementListenStat();
    };

    const MiniQuiz = ({ point }: { point: GrammarPoint }) => {
        const state = quizStates[point.pattern];
        
        if (!state) {
            return (
                 <button onClick={() => handleGenerateQuiz(point)} className="flex items-center gap-2 px-3 py-1.5 bg-hanguk-blue-100 dark:bg-hanguk-blue-900 text-hanguk-blue-700 dark:text-hanguk-blue-200 text-sm font-semibold rounded-lg hover:bg-hanguk-blue-200 transition-colors">
                    <SparklesIcon small /> Tạo câu hỏi AI
                </button>
            );
        }

        if (state.isLoading) return <Loader />;
        if (state.error) return <p className="text-red-500 text-sm">{state.error}</p>;
        if (!state.questions || state.questions.length === 0) return null;

        const question = state.questions[state.currentQuestionIndex];

        return (
            <div className="space-y-3 text-sm max-w-md">
                <p className="font-semibold">{question.question}</p>
                <div className="space-y-2">
                    {question.options.map(option => {
                        let buttonClass = "w-full p-2 text-left border rounded-md transition-colors ";
                         if (state.isAnswered) {
                            if (option === question.answer) buttonClass += "bg-green-100 border-green-400 text-green-800 dark:bg-green-900/50 dark:border-green-700 dark:text-green-300";
                            else if (option === state.userAnswer) buttonClass += "bg-red-100 border-red-400 text-red-800 dark:bg-red-900/50 dark:border-red-700 dark:text-red-300";
                            else buttonClass += "border-slate-200 dark:border-slate-600 opacity-60";
                        } else {
                             buttonClass += state.userAnswer === option 
                                ? "bg-hanguk-blue-100 border-hanguk-blue-400" 
                                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700";
                        }
                        return (
                            <button key={option} onClick={() => !state.isAnswered && handleQuizAnswer(point.pattern, option)} disabled={state.isAnswered} className={buttonClass}>
                                {option}
                            </button>
                        );
                    })}
                </div>
                 {state.isAnswered && (
                    <div className="p-2 bg-slate-200 dark:bg-slate-800 rounded-md animate-fade-in">
                        <p className={`font-bold ${state.userAnswer === question.answer ? 'text-green-600' : 'text-red-600'}`}>
                            {state.userAnswer === question.answer ? 'Chính xác!' : 'Chưa đúng.'}
                        </p>
                        <p className="text-xs">{question.explanation}</p>
                        <div className="text-right mt-1">
                             <button onClick={() => handleGenerateQuiz(point)} className="px-2 py-1 bg-hanguk-blue-600 text-white text-xs font-bold rounded-md hover:bg-hanguk-blue-700">
                                Thử câu khác
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto">
            <FeatureHeader
                title="Lộ trình Ngữ pháp"
                description="Học ngữ pháp tiếng Hàn một cách có hệ thống, từ cơ bản đến nâng cao, với tính năng theo dõi tiến độ."
            />
            
            <div className="sticky top-0 z-10 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-sm pt-4 pb-2 -my-4">
                <div className="mb-4 border-b-2 border-slate-200 dark:border-slate-700">
                    {data.map(level => (
                        <button 
                            key={level.levelId}
                            onClick={() => setActiveLevel(level.levelId)}
                            className={`px-4 py-2 font-semibold text-sm transition-colors ${activeLevel === level.levelId ? 'border-b-2 border-hanguk-blue-600 text-hanguk-blue-600 dark:text-hanguk-blue-300' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                        >
                            {level.levelName}
                        </button>
                    ))}
                </div>
                <div className="relative">
                    <input
                        type="text"
                        placeholder={`Tìm kiếm trong cấp độ ${data.find(l => l.levelId === activeLevel)?.levelName}...`}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full p-3 pl-10 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                    />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <div className="mt-8 space-y-4">
                {isLoadingProgress ? <div className="flex justify-center"><Loader /></div> : filteredCategories.length === 0 ? <p className="text-center text-slate-500">Không có kết quả nào.</p> : filteredCategories.map(category => {
                    const completedCount = category.points.filter(p => completedLessons.has(p.pattern)).length;
                    const totalCount = category.points.length;
                    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

                    return (
                        <div key={category.categoryName} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                            <button onClick={() => handleToggleCategory(category.categoryName)} className="w-full p-4 text-left">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{category.categoryName}</h3>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{completedCount} / {totalCount}</span>
                                        <svg className={`w-5 h-5 text-slate-400 transition-transform ${openCategories.has(category.categoryName) ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="mt-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                                    <div className="bg-hanguk-blue-600 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                                </div>
                            </button>
                            {openCategories.has(category.categoryName) && (
                                <div className="border-t border-slate-200 dark:border-slate-700">
                                    {category.points.map(point => {
                                        const isCompleted = completedLessons.has(point.pattern);
                                        const isLessonOpen = openLesson === point.pattern;
                                        return (
                                            <div key={point.pattern} id={`lesson-${point.pattern}`} className="border-b border-slate-100 dark:border-slate-700 last:border-b-0">
                                                <div className="flex items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                                    <button onClick={() => handleToggleLessonCompleted(point.pattern)} title="Đánh dấu hoàn thành" className="p-2">
                                                        <CheckCircleIcon className={`w-6 h-6 transition-colors ${isCompleted ? 'text-green-500' : 'text-slate-300 dark:text-slate-600'}`} />
                                                    </button>
                                                    <div onClick={() => setOpenLesson(isLessonOpen ? null : point.pattern)} className="flex-grow cursor-pointer pl-2">
                                                        <p className={`font-semibold ${isCompleted ? 'line-through text-slate-500' : 'text-hanguk-blue-700 dark:text-hanguk-blue-300'}`}>{point.pattern}</p>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400">{point.meaning}</p>
                                                    </div>
                                                </div>
                                                {isLessonOpen && (
                                                    <div className="p-4 border-t border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 space-y-4 animate-fade-in">
                                                        <div>
                                                            <h4 className="font-semibold text-sm text-slate-600 dark:text-slate-300">Giải thích</h4>
                                                            <p className="text-sm mt-1">{point.explanation}</p>
                                                        </div>
                                                        {point.culturalNote && (
                                                            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/50 rounded-md text-sm text-yellow-800 dark:text-yellow-200 flex items-start gap-2">
                                                                <LightbulbIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                                                <div>
                                                                    <strong className="font-bold">Ghi chú Văn hóa:</strong> {point.culturalNote}
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <h4 className="font-semibold text-sm text-slate-600 dark:text-slate-300">Cách chia</h4>
                                                            <p className="text-sm mt-1 font-mono bg-slate-100 dark:bg-slate-700 p-2 rounded-md whitespace-pre-wrap">{point.conjugation}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-sm text-slate-600 dark:text-slate-300">Ví dụ</h4>
                                                            <ul className="mt-2 space-y-3 text-sm">
                                                                {point.examples.map((ex, i) => (
                                                                    <li key={i} className="flex items-start justify-between">
                                                                        <div className="flex-grow space-y-1">
                                                                            <div className="group flex items-center gap-2">
                                                                                <p className="font-semibold">{ex.korean}</p>
                                                                                <button onClick={() => handleCopy(ex.korean)} className="p-1 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-200 dark:hover:bg-slate-600"><ClipboardDocumentIcon small/></button>
                                                                            </div>
                                                                            <div className="group flex items-center gap-2">
                                                                                <p className="text-cyan-600 dark:text-cyan-400 italic">{ex.romanization}</p>
                                                                                <button onClick={() => handleCopy(ex.romanization)} className="p-1 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-200 dark:hover:bg-slate-600"><ClipboardDocumentIcon small/></button>
                                                                            </div>
                                                                            <div className="group flex items-center gap-2">
                                                                                <p className="text-slate-500 dark:text-slate-400">"{ex.vietnamese}"</p>
                                                                                <button onClick={() => handleCopy(ex.vietnamese)} className="p-1 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-200 dark:hover:bg-slate-600"><ClipboardDocumentIcon small/></button>
                                                                            </div>
                                                                        </div>
                                                                        <button onClick={() => handleSpeak(ex.korean)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600" title="Nghe">
                                                                            <SpeakerIcon small />
                                                                        </button>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        {point.notes && (
                                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-md text-sm text-blue-800 dark:text-blue-200">
                                                                <strong>Lưu ý:</strong> {point.notes}
                                                            </div>
                                                        )}
                                                        <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-600 flex justify-between items-start">
                                                            <div>
                                                                <h4 className="font-bold text-sm text-slate-700 dark:text-slate-200 mb-2">Kiểm tra nhanh</h4>
                                                                <MiniQuiz point={point} />
                                                            </div>
                                                             <button onClick={() => handleAddToSrs(point)} className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-md hover:bg-green-700 ml-auto self-start">
                                                                <PlusIcon small /> Thêm vào SRS
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default GrammarReference;