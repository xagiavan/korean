import React, { useState, useEffect, useCallback } from 'react';
import * as geminiService from '../services/geminiService';
import * as historyService from '../services/historyService';
import * as learningHistoryService from '../services/learningHistoryService';
import type { VocabItem, AppFeatureProps, GrammarExample, GrammarExplanation, Badge } from '../types';
import Loader from './Loader';
import FeatureHeader from './FeatureHeader';
import { useAuth } from '../contexts/AuthContext';
import UpgradeToVipPrompt from './UpgradeToVipPrompt';
import { SpeakerIcon, PlusIcon, LightbulbIcon, CheckIcon, TranslateIcon, PronunciationIcon, SparklesIcon, DictionaryIcon, ClipboardDocumentIcon } from './icons/Icons';
import * as srsService from '../services/srsService';
import * as gamificationService from '../services/gamificationService';
import * as statsService from '../services/statsService';
import { speak } from '../services/ttsService';
import { useToast } from '../contexts/ToastContext';
import ContextualActionBar from './ContextualActionBar';
import MiniPronunciationPractice from './MiniPronunciationPractice';

const COMMON_SEARCH_TERMS = [
  '가족', '음식', '사랑', '친구', '학교', '공부하다', '감사합니다', '안녕하세요', '죄송합니다', '괜찮아요',
  '먹다', '자다', '보다', '가다', '오다', '있다', '없다', '좋다', '싫다', '크다', '작다'
];

const Dictionary: React.FC<AppFeatureProps> = ({ setActiveFeature, payload }) => {
    const { currentUser } = useAuth();
    const { addToast, showBadgeCelebration } = useToast();
    const [query, setQuery] = useState('');
    const [result, setResult] = useState<VocabItem | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<VocabItem[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
    const [addedWords, setAddedWords] = useState<Set<string>>(new Set());
    const [showPractice, setShowPractice] = useState(false);
    
    const [exampleTranslation, setExampleTranslation] = useState<string>('');
    const [isTranslatingExample, setIsTranslatingExample] = useState(false);

    // AI Features Tab
    const [activeTab, setActiveTab] = useState<'examples' | 'grammar'>('examples');
    
    // AI Usage Examples State
    const [exampleQuery, setExampleQuery] = useState('');
    const [usageExamples, setUsageExamples] = useState<GrammarExample[]>([]);
    const [isGeneratingExamples, setIsGeneratingExamples] = useState(false);

    // AI Grammar Explanation State
    const [grammarQuery, setGrammarQuery] = useState('');
    const [grammarExplanation, setGrammarExplanation] = useState<GrammarExplanation | null>(null);
    const [isExplainingGrammar, setIsExplainingGrammar] = useState(false);
    const [grammarError, setGrammarError] = useState<string | null>(null);


    const updateHistory = useCallback(async () => {
        if (currentUser?.email) {
            setHistory(await historyService.getHistory());
        }
    }, [currentUser]);
    
    useEffect(() => {
        updateHistory();
    }, [updateHistory]);

    const handleSearch = useCallback(async (word: string) => {
        if (!word.trim()) return;
        
        setSuggestions([]); // Hide suggestions on search
        setIsLoading(true);
        setError(null);
        setResult(null);
        setShowPractice(false);
        setExampleTranslation('');
        setIsTranslatingExample(false);

        if (!currentUser?.isVip) {
            const sample = geminiService.sampleTopikVocab[0];
            setResult({ ...sample, word: word });
            if (sample.example_translation) {
                setExampleTranslation(sample.example_translation);
            }
            setIsLoading(false);
            return;
        }

        try {
            const data = await geminiService.lookupDictionaryWord(word);
            setResult(data);
             if (data?.example_translation) {
                setExampleTranslation(data.example_translation);
            }
            if(data && currentUser?.email){
                await historyService.addHistoryItem(data);
                await learningHistoryService.addHistoryItem('vocab', data);
                await gamificationService.addXp(2);
                await gamificationService.recordDictionaryLookup(data.word);
                updateHistory();
            } else {
                setError(`Không tìm thấy từ "${word}". Vui lòng kiểm tra lại chính tả.`);
            }
        } catch (e) {
            setError('Đã xảy ra lỗi khi tra từ.');
        } finally {
            setIsLoading(false);
        }
    }, [currentUser, updateHistory]);

    useEffect(() => {
        if (payload?.word) {
            setQuery(payload.word);
            handleSearch(payload.word);
        }
    }, [payload, handleSearch]);

    useEffect(() => {
        const queryTrimmed = query.trim();
        if (queryTrimmed.length < 1) {
            setSuggestions([]);
            setIsSuggestionsLoading(false);
            return;
        }

        // --- 1. Get Local Suggestions (for all users) ---
        const lowercasedQuery = queryTrimmed.toLowerCase();
        const historySuggestions = history
            .map(item => item.word)
            .filter(word => word.toLowerCase().startsWith(lowercasedQuery));
            
        const commonSuggestions = COMMON_SEARCH_TERMS
            .filter(term => term.toLowerCase().startsWith(lowercasedQuery));

        // Use a Set for instant deduplication, prioritize history
        const localSuggestions = [...new Set([...historySuggestions, ...commonSuggestions])];
        setSuggestions(localSuggestions.slice(0, 10)); // Show local suggestions immediately

        // --- 2. Fetch AI Suggestions (for VIPs) ---
        if (!currentUser?.isVip) {
            return; // Exit for non-VIPs
        }
        
        setIsSuggestionsLoading(true); // Start loading indicator for AI part
        const debounceTimer = setTimeout(async () => {
            try {
                const aiData = await geminiService.getAutocompleteSuggestions(query);
                // Merge AI suggestions with local ones, ensuring no duplicates
                setSuggestions(prev => {
                    const combined = [...new Set([...prev, ...aiData])];
                    return combined.slice(0, 10); // Limit total display
                });
            } catch (error) {
                console.error("Error fetching AI suggestions:", error);
                // On AI error, we just keep the local suggestions
            } finally {
                setIsSuggestionsLoading(false);
            }
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [query, currentUser?.isVip, history]); // `history` is a dependency


    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        setSuggestions([]);
        handleSearch(suggestion);
    };

    const handleAddToSrs = async (item: VocabItem) => {
        if (!currentUser?.email) return;
        const count = await srsService.addWordsToDeck([item]);
        if (count > 0) {
            addToast({ type: 'success', title: 'Đã thêm!', message: `"${item.word}" đã được thêm vào bộ ôn tập.` });
            const { newBadges: xpBadges } = await gamificationService.addXp(2);
            const srsBadges = await gamificationService.checkSrsBadges();
            showBadgeCelebration([...xpBadges, ...srsBadges]);
            setAddedWords(prev => new Set(prev).add(item.word));
            setTimeout(() => {
                setAddedWords(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(item.word);
                    return newSet;
                });
            }, 2000);
        } else {
            addToast({ type: 'info', title: 'Đã có', message: `"${item.word}" đã có trong bộ ôn tập của bạn.` });
        }
    };
    
    const handleSpeak = async (text: string) => {
        if (!currentUser?.email) return;
        speak(text);
        await statsService.incrementListenStat();
    }
    
    const handleTranslateExample = useCallback(async () => {
        if (!result?.example_sentence) return;
        
        if (!currentUser?.isVip) {
            addToast({
                type: 'warning',
                title: 'Tính năng VIP',
                message: 'Dịch nhanh câu ví dụ là tính năng VIP.'
            });
            return;
        }

        setIsTranslatingExample(true);
        try {
            const translationResult = await geminiService.translateText(result.example_sentence, 'Korean', 'Vietnamese');
            setExampleTranslation(translationResult.translation);
            if (currentUser?.email) {
                await gamificationService.addXp(2);
            }
        } catch (e) {
            console.error("Example translation error:", e);
            addToast({ type: 'error', title: 'Lỗi', message: 'Không thể dịch câu ví dụ.' });
        } finally {
            setIsTranslatingExample(false);
        }
    }, [result, currentUser, addToast]);
    
    const handleGenerateExamples = useCallback(async () => {
        if (!exampleQuery.trim()) return;
        if (!currentUser?.isVip) {
            setUsageExamples(geminiService.sampleUsageExamples);
            addToast({ type: 'warning', title: 'Tính năng VIP', message: 'Tạo ví dụ sử dụng bằng AI là tính năng VIP.' });
            return;
        }
        if (!currentUser?.email) return;

        setIsGeneratingExamples(true);
        setUsageExamples([]);
        try {
            const examples = await geminiService.generateUsageExamples(exampleQuery);
            setUsageExamples(examples || []);
            await gamificationService.addXp(10);
        } catch (e) {
            console.error("Error generating examples:", e);
            addToast({ type: 'error', title: 'Lỗi', message: 'Không thể tạo ví dụ.' });
        } finally {
            setIsGeneratingExamples(false);
        }
    }, [exampleQuery, currentUser, addToast]);

    const handleExplainGrammar = useCallback(async () => {
        if (!grammarQuery.trim()) return;

        if (!currentUser?.isVip) {
            setGrammarExplanation(geminiService.sampleGrammarExplanation);
            addToast({ type: 'warning', title: 'Tính năng VIP', message: 'Hỏi ngữ pháp AI là tính năng VIP. Đây là ví dụ mẫu.' });
            return;
        }
        if (!currentUser?.email) return;

        setIsExplainingGrammar(true);
        setGrammarExplanation(null);
        setGrammarError(null);

        try {
            const result = await geminiService.explainGrammarPoint(grammarQuery);
            if (result) {
                setGrammarExplanation(result);
                await gamificationService.addXp(15);
            } else {
                setGrammarError('Không thể giải thích ngữ pháp này. Vui lòng thử lại.');
            }
        } catch (e) {
            console.error("Error explaining grammar:", e);
            setGrammarError('Đã xảy ra lỗi khi kết nối với Gia sư AI.');
        } finally {
            setIsExplainingGrammar(false);
        }
    }, [grammarQuery, currentUser, addToast]);
    
    const handleResetGrammar = () => {
        setGrammarQuery('');
        setGrammarExplanation(null);
        setGrammarError(null);
    };

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


    return (
        <div className="max-w-4xl mx-auto">
            <FeatureHeader
                title="Từ điển AI"
                description="Tra cứu từ vựng tiếng Hàn với giải thích chi tiết, ví dụ và phát âm."
            />
            
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(query); }} className="mb-6 flex gap-2">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Nhập từ tiếng Hàn..."
                        className="w-full p-3 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-hanguk-blue-500 focus:border-hanguk-blue-500 transition-all-base"
                        autoComplete="off"
                    />
                    { (suggestions.length > 0 || (isSuggestionsLoading && currentUser?.isVip)) && query.trim().length > 0 &&
                        <div className="absolute top-full w-full mt-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg z-10 animate-fade-in">
                            <ul role="listbox">
                                {suggestions.map(suggestion => (
                                    <li key={suggestion}
                                        role="option"
                                        className="px-4 py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 border-b border-slate-200 dark:border-slate-600 last:border-b-0"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        onMouseDown={(e) => e.preventDefault()}
                                    >
                                        {suggestion}
                                    </li>
                                ))}
                                {isSuggestionsLoading && (
                                    <li className="px-4 py-2 text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2" aria-hidden="true">
                                        <Loader size="sm" inline />
                                        <span>Đang tải gợi ý từ AI...</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    }
                </div>
                <button type="submit" disabled={isLoading || !query.trim()} className="px-6 py-3 bg-hanguk-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-hanguk-blue-700 disabled:bg-slate-400">
                    {isLoading ? 'Đang tìm...' : 'Tra cứu'}
                </button>
            </form>

            {!currentUser?.isVip && <UpgradeToVipPrompt featureName="tra cứu từ điển không giới hạn" setActiveFeature={setActiveFeature as any} />}

            {isLoading && <Loader />}
            {error && <p className="text-red-500 text-center">{error}</p>}
            
            {result && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md animate-fade-in-up">
                    <div className="flex justify-between items-start">
                        <div>
                             <div className="flex items-center gap-2">
                                <h2 className="text-3xl sm:text-4xl font-bold text-hanguk-blue-800 dark:text-hanguk-blue-300">{result.word}</h2>
                                <button onClick={() => handleCopy(result.word)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 self-center" title="Sao chép từ">
                                    <ClipboardDocumentIcon small />
                                </button>
                            </div>
                            <p className="text-lg text-slate-500 italic">{result.romanization} <span className="text-sm">({result.partOfSpeech})</span></p>
                        </div>
                        <div className="flex gap-2">
                             <button onClick={() => handleSpeak(result.word)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700" title="Nghe"><SpeakerIcon /></button>
                             <button onClick={() => setShowPractice(p => !p)} className={`p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${showPractice ? 'bg-hanguk-blue-100 dark:bg-hanguk-blue-900' : ''}`} title="Luyện phát âm"><PronunciationIcon /></button>
                             <button onClick={() => handleAddToSrs(result)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700" title="Thêm vào SRS">
                                {addedWords.has(result.word) ? <CheckIcon className="text-green-500" /> : <PlusIcon />}
                             </button>
                        </div>
                    </div>
                     <div className="flex items-center gap-2 mt-4">
                        <p className="text-xl">{result.meaning}</p>
                        <button onClick={() => handleCopy(result.meaning)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400" title="Sao chép nghĩa">
                            <ClipboardDocumentIcon small />
                        </button>
                    </div>
                    
                    {showPractice && <MiniPronunciationPractice koreanText={result.word} />}

                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
                        <p className="font-semibold">Ví dụ:</p>
                        <div className="group flex items-start justify-between gap-2">
                            <p className="text-lg flex-grow">{result.example_sentence}</p>
                            <div className="flex items-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleSpeak(result.example_sentence)} className="p-1 text-slate-500 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600" title="Nghe"><SpeakerIcon small/></button>
                                <button onClick={() => handleCopy(result.example_sentence)} className="p-1 text-slate-500 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600" title="Sao chép"><ClipboardDocumentIcon small/></button>
                            </div>
                        </div>
                        {exampleTranslation ? (
                             <div className="group flex items-start justify-between gap-2">
                                <p className="text-slate-500 dark:text-slate-400 animate-fade-in flex-grow">"{exampleTranslation}"</p>
                                <button onClick={() => handleCopy(exampleTranslation)} className="p-1 text-slate-500 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" title="Sao chép"><ClipboardDocumentIcon small/></button>
                            </div>
                        ) : (
                            result.example_sentence &&
                            <button 
                                onClick={handleTranslateExample} 
                                disabled={isTranslatingExample}
                                className="mt-1 text-sm font-semibold text-hanguk-blue-600 dark:text-hanguk-blue-400 hover:underline disabled:opacity-70 disabled:cursor-wait flex items-center gap-1"
                            >
                                {isTranslatingExample ? (
                                    <>
                                        <Loader size="sm" inline /> 
                                        Đang dịch...
                                    </>
                                ) : (
                                    <>
                                        <TranslateIcon small /> 
                                        Dịch ví dụ
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                    <ContextualActionBar word={result.word} setActiveFeature={setActiveFeature} />
                </div>
            )}

            {!result && (
                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-2">Lịch sử tra cứu</h3>
                    {history.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {history.map(item => (
                                <button key={item.word} onClick={() => { setQuery(item.word); handleSearch(item.word); }} className="px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded-full text-sm hover:bg-slate-300 dark:hover:bg-slate-600">
                                    {item.word}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 px-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg flex flex-col items-center">
                            <div className="p-4 bg-slate-200 dark:bg-slate-700 rounded-full mb-4">
                                <DictionaryIcon className="w-8 h-8 text-slate-500 dark:text-slate-400" />
                            </div>
                            <p className="font-semibold text-slate-600 dark:text-slate-300">Lịch sử tra cứu của bạn trống.</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Bắt đầu tra một từ để xem nó ở đây.</p>
                            <button onClick={() => setActiveFeature('vocab')} className="mt-4 px-4 py-2 bg-hanguk-blue-100 dark:bg-hanguk-blue-900 text-hanguk-blue-700 dark:text-hanguk-blue-300 font-semibold rounded-lg text-sm hover:bg-hanguk-blue-200 dark:hover:bg-hanguk-blue-800 transition-colors">
                                Khám phá từ vựng mới
                            </button>
                        </div>
                    )}
                </div>
            )}

            <div className="mt-8 bg-white dark:bg-slate-800 rounded-lg shadow-md">
                <div className="border-b-2 border-slate-200 dark:border-slate-700">
                    <button onClick={() => setActiveTab('examples')} className={`px-4 py-3 font-semibold text-sm transition-colors ${activeTab === 'examples' ? 'border-b-2 border-hanguk-blue-600 text-hanguk-blue-600 dark:text-hanguk-blue-300' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}>
                        Khám phá Cách dùng từ
                    </button>
                    <button onClick={() => setActiveTab('grammar')} className={`px-4 py-3 font-semibold text-sm transition-colors ${activeTab === 'grammar' ? 'border-b-2 border-hanguk-blue-600 text-hanguk-blue-600 dark:text-hanguk-blue-300' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}>
                        Hỏi Ngữ pháp AI
                    </button>
                </div>
                
                {activeTab === 'examples' && (
                    <div className="p-6">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                            Nhập một từ hoặc cụm từ để xem các ví dụ sử dụng đa dạng do AI tạo ra.
                        </p>
                        <form onSubmit={(e) => { e.preventDefault(); handleGenerateExamples(); }} className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="text"
                                value={exampleQuery}
                                onChange={e => setExampleQuery(e.target.value)}
                                placeholder="Ví dụ: 공부하다, 행복..."
                                className="flex-grow p-3 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-hanguk-blue-500 focus:border-hanguk-blue-500 transition-all-base"
                            />
                            <button type="submit" disabled={isGeneratingExamples || !exampleQuery.trim()} className="px-6 py-3 bg-hanguk-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-hanguk-blue-700 disabled:bg-slate-400 flex items-center justify-center gap-2">
                                {isGeneratingExamples ? <Loader size="sm" inline /> : <SparklesIcon />}
                                {isGeneratingExamples ? 'Đang tạo...' : 'Tạo ví dụ'}
                            </button>
                        </form>
                        {isGeneratingExamples && !usageExamples.length && (
                            <div className="mt-4 flex justify-center"><Loader /></div>
                        )}
                        {usageExamples.length > 0 && (
                            <div className="mt-6 space-y-3 animate-fade-in">
                                <h4 className="font-semibold">Ví dụ cho "{exampleQuery}":</h4>
                                {usageExamples.map((ex, i) => (
                                    <div key={i} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-md">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-grow space-y-1">
                                                <div className="group flex items-center gap-2">
                                                    <p className="font-semibold">{ex.korean}</p>
                                                    <button onClick={() => handleCopy(ex.korean)} className="p-1 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-200 dark:hover:bg-slate-600"><ClipboardDocumentIcon small/></button>
                                                </div>
                                                <div className="group flex items-center gap-2">
                                                    <p className="text-cyan-600 dark:text-cyan-400 italic text-sm">{ex.romanization}</p>
                                                    <button onClick={() => handleCopy(ex.romanization)} className="p-1 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-200 dark:hover:bg-slate-600"><ClipboardDocumentIcon small/></button>
                                                </div>
                                                <div className="group flex items-center gap-2">
                                                    <p className="text-slate-500 dark:text-slate-400 text-sm">"{ex.vietnamese}"</p>
                                                    <button onClick={() => handleCopy(ex.vietnamese)} className="p-1 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-200 dark:hover:bg-slate-600"><ClipboardDocumentIcon small/></button>
                                                </div>
                                            </div>
                                            <button onClick={() => handleSpeak(ex.korean)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500 flex-shrink-0" title="Nghe câu ví dụ">
                                                <SpeakerIcon small />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'grammar' && (
                    <div className="p-6">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                            Gặp khó khăn với một cấu trúc ngữ pháp? Hãy hỏi Gia sư AI để nhận giải thích chi tiết.
                        </p>
                        <form onSubmit={(e) => { e.preventDefault(); handleExplainGrammar(); }} className="flex flex-col gap-2">
                             <textarea
                                value={grammarQuery}
                                onChange={e => setGrammarQuery(e.target.value)}
                                placeholder="Ví dụ: Sự khác biệt giữa -고 và -아서/어서 là gì?"
                                rows={3}
                                className="w-full p-3 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-hanguk-blue-500 focus:border-hanguk-blue-500 transition-all-base"
                            />
                            <div className="flex justify-end gap-2">
                                {grammarExplanation && <button type="button" onClick={handleResetGrammar} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700">Hỏi câu khác</button>}
                                <button type="submit" disabled={isExplainingGrammar || !grammarQuery.trim()} className="px-6 py-3 bg-hanguk-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-hanguk-blue-700 disabled:bg-slate-400 flex items-center justify-center gap-2">
                                    {isExplainingGrammar ? <Loader size="sm" inline /> : <SparklesIcon />}
                                    {isExplainingGrammar ? 'Đang trả lời...' : 'Hỏi AI'}
                                </button>
                            </div>
                        </form>
                        {isExplainingGrammar && !grammarExplanation && <div className="mt-4 flex justify-center"><Loader /></div>}
                        {grammarError && <p className="mt-4 text-center text-red-500">{grammarError}</p>}
                        {grammarExplanation && (
                            <div className="mt-6 space-y-4 border-t border-slate-200 dark:border-slate-700 pt-4 animate-fade-in">
                                <h2 className="text-2xl font-bold text-hanguk-blue-800 dark:text-hanguk-blue-300">{grammarExplanation.grammar_point}</h2>
                                <div>
                                    <h4 className="font-semibold text-slate-700 dark:text-slate-200">Giải thích</h4>
                                    <p className="mt-1 text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{grammarExplanation.explanation}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-700 dark:text-slate-200">Ví dụ</h4>
                                    <ul className="mt-2 space-y-3">
                                        {grammarExplanation.examples.map((ex, i) => (
                                            <li key={i} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-md">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-grow space-y-1">
                                                        <div className="group flex items-center gap-2">
                                                            <p className="font-semibold">{ex.korean}</p>
                                                            <button onClick={() => handleCopy(ex.korean)} className="p-1 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-200 dark:hover:bg-slate-600"><ClipboardDocumentIcon small/></button>
                                                        </div>
                                                        <div className="group flex items-center gap-2">
                                                            <p className="text-cyan-600 dark:text-cyan-400 italic text-sm">{ex.romanization}</p>
                                                            <button onClick={() => handleCopy(ex.romanization)} className="p-1 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-200 dark:hover:bg-slate-600"><ClipboardDocumentIcon small/></button>
                                                        </div>
                                                        <div className="group flex items-center gap-2">
                                                            <p className="text-slate-500 dark:text-slate-400 text-sm">"{ex.vietnamese}"</p>
                                                            <button onClick={() => handleCopy(ex.vietnamese)} className="p-1 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-200 dark:hover:bg-slate-600"><ClipboardDocumentIcon small/></button>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => handleSpeak(ex.korean)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600" title="Nghe">
                                                        <SpeakerIcon small />
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                 {grammarExplanation.common_mistakes && (
                                    <div>
                                        <h4 className="font-semibold text-slate-700 dark:text-slate-200">Lỗi thường gặp</h4>
                                        <div className="mt-1 p-3 bg-yellow-100 dark:bg-yellow-900/50 rounded-md text-sm text-yellow-800 dark:text-yellow-200 flex items-start gap-2">
                                            <LightbulbIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                            <p>{grammarExplanation.common_mistakes}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dictionary;