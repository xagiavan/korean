import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as srsService from '../services/srsService';
import type { AppFeatureProps, VocabItem } from '../types';
import FeatureHeader from './FeatureHeader';
import * as gamificationService from '../services/gamificationService';
import { VocabIcon, TrophyIcon, PronunciationIcon, MediaIcon, DictionaryIcon, DownloadIcon, PlusIcon, Bars2Icon } from './icons/Icons';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Loader from './Loader';

const BATCH_SIZE = 10;

const SpacedRepetition: React.FC<AppFeatureProps> = ({ setActiveFeature }) => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const [reviewBatch, setReviewBatch] = useState<VocabItem[]>([]);
    const [totalDue, setTotalDue] = useState(0);
    const [totalDeckSize, setTotalDeckSize] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });
    const [isBatchComplete, setIsBatchComplete] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const [mode, setMode] = useState<'prepare' | 'review'>('prepare');
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);
    const [dragging, setDragging] = useState(false);

    const loadStats = useCallback(async () => {
        if (!currentUser?.email) return;
        const stats = await srsService.getDeckStats();
        setTotalDue(stats.dueForReview);
        setTotalDeckSize(stats.total);
    }, [currentUser]);

    const loadNextBatch = useCallback(async () => {
        if (!currentUser?.email) return;
        setIsLoading(true);
        const nextBatch = await srsService.getReviewQueue(BATCH_SIZE);
        setReviewBatch(nextBatch);
        setCurrentIndex(0);
        setIsFlipped(false);
        setIsBatchComplete(false);
        setMode('prepare');
        setIsLoading(false);
    }, [currentUser]);

    useEffect(() => {
        const init = async () => {
            await loadStats();
            await loadNextBatch();
        }
        if (currentUser?.email) {
            init();
        }
    }, [loadStats, loadNextBatch, currentUser]);

    const handleResponse = async (isCorrect: boolean) => {
        const currentItem = reviewBatch[currentIndex];
        if (!currentItem || !currentUser?.email) return;

        await srsService.updateItem(currentItem.word, isCorrect);
        await gamificationService.addXp(15);
        
        if (isCorrect) {
            setSessionStats(s => ({ ...s, correct: s.correct + 1 }));
        } else {
            setSessionStats(s => ({ ...s, incorrect: s.incorrect + 1 }));
        }

        if (currentIndex < reviewBatch.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false);
        } else {
            setIsBatchComplete(true);
            await loadStats(); 
        }
    };
    
    const handleContinue = () => {
        loadNextBatch();
    };
    
    const handleFinishSession = () => {
        setReviewBatch([]);
        setMode('prepare'); 
    };

    const handleDownloadCsv = async () => {
        setIsDownloading(true);
        try {
            const deck = await srsService.getDeck();
            if (deck.length === 0) {
                addToast({type: 'info', title: 'Bộ ôn tập trống', message: 'Không có từ nào để tải xuống.'});
                return;
            }
            const headers = "word,romanization,partOfSpeech,meaning,example_sentence,example_translation,srsLevel,nextReview";
            const csvContent = [
                headers,
                ...deck.map(item => [
                    `"${item.word.replace(/"/g, '""')}"`,
                    `"${item.romanization.replace(/"/g, '""')}"`,
                    `"${item.meaning.replace(/"/g, '""')}"`,
                    `"${item.partOfSpeech.replace(/"/g, '""')}"`,
                    `"${item.example_sentence.replace(/"/g, '""')}"`,
                    `"${item.example_translation.replace(/"/g, '""')}"`,
                    item.srsLevel,
                    item.nextReview
                ].join(','))
            ].join('\n');
            
            const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "srs_deck.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            addToast({type: 'success', title: 'Đã tải xuống', message: 'Bộ ôn tập của bạn đã được xuất ra file CSV.'});
        } catch (error) {
            console.error("CSV download error:", error);
            addToast({type: 'error', title: 'Lỗi', message: 'Không thể tải xuống file CSV.'});
        } finally {
            setIsDownloading(false);
        }
    };

    // --- Drag and Drop Handlers ---
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        dragItem.current = index;
        setDragging(true);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        dragOverItem.current = index;
        if (dragItem.current !== null && dragOverItem.current !== dragItem.current) {
            const newBatch = [...reviewBatch];
            const dragged = newBatch.splice(dragItem.current, 1)[0];
            newBatch.splice(dragOverItem.current, 0, dragged);
            dragItem.current = dragOverItem.current;
            setReviewBatch(newBatch);
        }
    };

    const handleDragEnd = () => {
        dragItem.current = null;
        dragOverItem.current = null;
        setDragging(false);
    };

    if (isLoading) {
        return (
             <div className="max-w-2xl mx-auto text-center">
                 <FeatureHeader
                    title="Ôn tập (SRS)"
                    description="Sử dụng phương pháp lặp lại ngắt quãng để ghi nhớ từ vựng hiệu quả."
                />
                 <div className="flex justify-center items-center h-64"><Loader /></div>
            </div>
        );
    }


    if (reviewBatch.length === 0) {
        return (
            <div className="max-w-2xl mx-auto text-center">
                 <FeatureHeader
                    title="Ôn tập (SRS)"
                    description="Sử dụng phương pháp lặp lại ngắt quãng để ghi nhớ từ vựng hiệu quả."
                />
                <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md flex flex-col items-center">
                    {totalDeckSize === 0 ? (
                        <>
                            <div className="mb-4">
                                <svg className="w-20 h-20 text-slate-300 dark:text-slate-600 mx-auto" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M48 16.0001L16 16.0001C13.7909 16.0001 12 17.7909 12 20.0001V48.0001C12 50.2092 13.7909 52.0001 16 52.0001H48C50.2091 52.0001 52 50.2092 52 48.0001V20.0001C52 17.7909 50.2091 16.0001 48 16.0001Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 6"/>
                                    <path d="M26 34H38" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M32 28V40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M8 12H44C46.2091 12 48 13.7909 48 16V18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6"/>
                                    <path d="M4 8H40C42.2091 8 44 9.79094 44 12V14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.3"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold">Bộ ôn tập của bạn đang trống!</h3>
                            <p className="text-slate-500 mt-2 max-w-md mb-6">
                                Thêm từ vựng đầu tiên của bạn để bắt đầu xây dựng thói quen học tập. Bạn có thể thêm từ từ bất kỳ đâu trong ứng dụng.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button onClick={() => setActiveFeature('dictionary')} className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                                    <DictionaryIcon small /> Tra từ điển
                                </button>
                                <button onClick={() => setActiveFeature('vocab')} className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                                    <VocabIcon small /> Khám phá TOPIK
                                </button>
                                <button onClick={() => setActiveFeature('add_word')} className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                                    <PlusIcon small /> Thêm từ tùy chỉnh
                                </button>
                            </div>
                        </>
                    ) : (
                         <>
                            <TrophyIcon className="w-16 h-16 text-yellow-500 mb-4" />
                            <h3 className="text-2xl font-semibold">Hoàn thành!</h3>
                            <p className="text-slate-500 mt-2">Bạn đã ôn tập xong tất cả các từ cho hôm nay. Làm tốt lắm!</p>
                             <div className="flex gap-6 mt-4 font-semibold">
                                <span className="text-green-500">Đúng: {sessionStats.correct}</span>
                                <span className="text-red-500">Sai: {sessionStats.incorrect}</span>
                            </div>
                             <div className="mt-6 flex flex-col sm:flex-row gap-4">
                                <button onClick={() => { setSessionStats({correct: 0, incorrect: 0}); loadNextBatch(); }} className="px-6 py-3 bg-hanguk-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-hanguk-blue-700">
                                    Bắt đầu phiên mới
                                </button>
                                <button onClick={handleDownloadCsv} disabled={isDownloading} className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 dark:bg-slate-700 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50">
                                    <DownloadIcon /> {isDownloading ? 'Đang xử lý...' : 'Tải xuống (CSV)'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }
    
    if (isBatchComplete) {
         return (
            <div className="max-w-2xl mx-auto text-center">
                <FeatureHeader
                    title="Ôn tập (SRS)"
                    description="Sử dụng phương pháp lặp lại ngắt quãng để ghi nhớ từ vựng hiệu quả."
                />
                <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md flex flex-col items-center animate-fade-in">
                    <TrophyIcon className="w-16 h-16 text-yellow-500 mb-4" />
                    <h3 className="text-2xl font-semibold">Hoàn thành đợt ôn tập!</h3>
                    <p className="text-slate-500 mt-2">Bạn vừa hoàn thành {reviewBatch.length} thẻ.</p>
                    <p className="text-slate-500 mt-1">Còn <span className="font-bold text-hanguk-blue-600 dark:text-hanguk-blue-400">{totalDue}</span> thẻ nữa cần ôn tập.</p>
                     <div className="mt-6 flex flex-col sm:flex-row gap-4">
                        <button onClick={handleContinue} className="px-6 py-3 bg-hanguk-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-hanguk-blue-700">
                            Ôn tập {Math.min(BATCH_SIZE, totalDue)} thẻ tiếp theo
                        </button>
                        <button onClick={handleFinishSession} className="px-6 py-2 bg-slate-200 dark:bg-slate-600 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700">
                            Kết thúc phiên
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (mode === 'prepare') {
        return (
            <div className="max-w-2xl mx-auto">
                <FeatureHeader
                    title="Chuẩn bị Ôn tập"
                    description="Bạn có thể kéo và thả để sắp xếp lại thứ tự các thẻ trước khi bắt đầu."
                />
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                    <div className="space-y-2 mb-6">
                        {reviewBatch.map((item, index) => (
                            <div
                                key={item.word}
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragEnter={(e) => handleDragEnter(e, index)}
                                onDragEnd={handleDragEnd}
                                onDragOver={(e) => e.preventDefault()}
                                className={`flex items-center gap-4 p-3 rounded-lg border-2 transition-all-base cursor-grab ${dragging ? 'border-dashed' : 'border-transparent'} ${dragItem.current === index ? 'opacity-50 bg-hanguk-blue-100' : 'bg-slate-50 dark:bg-slate-700'}`}
                            >
                                <Bars2Icon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                                <div className="flex-grow">
                                    <p className="font-bold">{item.word}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.meaning}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => setMode('review')}
                        className="w-full px-6 py-3 bg-hanguk-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-hanguk-blue-700"
                    >
                        Bắt đầu Ôn tập ({reviewBatch.length} thẻ)
                    </button>
                </div>
            </div>
        );
    }
    
    const currentItem = reviewBatch[currentIndex];

    return (
        <div className="max-w-2xl mx-auto text-center">
             <FeatureHeader
                title="Ôn tập (SRS)"
                description="Sử dụng phương pháp lặp lại ngắt quãng để ghi nhớ từ vựng hiệu quả."
            />
            
            <div className="mb-4 flex justify-between font-semibold">
                <span>Tiến độ đợt này: {currentIndex + 1} / {reviewBatch.length}</span>
                <span>Còn lại: {totalDue - currentIndex}</span>
            </div>

            <div 
                className={`w-full h-64 sm:h-80 perspective-1000`}
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                    {/* Front of card */}
                    <div className="absolute w-full h-full backface-hidden bg-white dark:bg-slate-800 rounded-lg shadow-lg flex flex-col items-center justify-center p-4">
                        <h2 className="text-4xl sm:text-5xl font-bold text-hanguk-blue-800 dark:text-hanguk-blue-300 break-all px-2">{currentItem.word}</h2>
                        <p className="mt-2 text-slate-500">({currentItem.partOfSpeech})</p>
                        <p className="absolute bottom-4 text-sm text-slate-400">Nhấn để xem nghĩa</p>
                    </div>
                    {/* Back of card */}
                     <div className="absolute w-full h-full backface-hidden bg-hanguk-blue-50 dark:bg-hanguk-blue-900/50 rounded-lg shadow-lg flex flex-col items-center justify-center p-4 rotate-y-180">
                        <h3 className="text-3xl sm:text-4xl font-bold">{currentItem.meaning}</h3>
                        <p className="text-base sm:text-lg italic text-slate-500">{currentItem.romanization}</p>
                        <div className="mt-4 text-left w-full text-sm text-slate-600 dark:text-slate-300">
                             <p><strong>Ví dụ:</strong> {currentItem.example_sentence}</p>
                             <p><em>"{currentItem.example_translation}"</em></p>
                        </div>
                        {/* Contextual Action Bar */}
                        <div className="absolute bottom-2 left-2 right-2 flex justify-around p-1 bg-white/50 dark:bg-slate-800/50 rounded-lg backdrop-blur-sm">
                            <button onClick={(e) => { e.stopPropagation(); setActiveFeature('pronunciation'); }} className="flex-1 flex flex-col items-center text-xs text-slate-600 dark:text-slate-300 hover:text-hanguk-blue-600 transition-colors p-1 rounded-md" title="Luyện phát âm">
                                <PronunciationIcon small />
                                Phát âm
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setActiveFeature('dictionary', { word: currentItem.word }); }} className="flex-1 flex flex-col items-center text-xs text-slate-600 dark:text-slate-300 hover:text-hanguk-blue-600 transition-colors p-1 rounded-md" title="Xem trong Từ điển">
                                <DictionaryIcon small />
                                Từ điển
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setActiveFeature('media'); }} className="flex-1 flex flex-col items-center text-xs text-slate-600 dark:text-slate-300 hover:text-hanguk-blue-600 transition-colors p-1 rounded-md" title="Tìm trong Media">
                                <MediaIcon small />
                                Media
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {isFlipped && (
                 <div className="mt-6 flex justify-center gap-4 animate-fade-in">
                    <button onClick={() => handleResponse(false)} className="px-6 py-3 sm:px-8 bg-red-500 text-white font-bold rounded-lg shadow-md hover:bg-red-600 transition-transform hover:scale-105">
                        Chưa thuộc
                    </button>
                     <button onClick={() => handleResponse(true)} className="px-6 py-3 sm:px-8 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition-transform hover:scale-105">
                        Đã thuộc
                    </button>
                </div>
            )}
        </div>
    );
};

export default SpacedRepetition;