import React, { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as geminiService from '../services/geminiService';
import type { GrammarExplanation, VocabItem, AppFeatureProps } from '../types';
import * as srsService from '../services/srsService';
import * as gamificationService from '../services/gamificationService';
import { speak } from '../services/ttsService';
import FeatureHeader from './FeatureHeader';
import Loader from './Loader';
import UpgradeToVipPrompt from './UpgradeToVipPrompt';
import { SparklesIcon, SpeakerIcon, PlusIcon, LightbulbIcon, ClipboardDocumentIcon } from './icons/Icons';
import { useToast } from '../contexts/ToastContext';


const exampleQuestions = [
    "Sự khác biệt giữa -고 và -아서/어서 là gì?",
    "Khi nào dùng trợ từ -은/는 và khi nào dùng -이/가?",
    "Giải thích cách dùng định ngữ thì quá khứ.",
];

const GrammarHelper: React.FC<AppFeatureProps> = ({ setActiveFeature }) => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const [query, setQuery] = useState('');
    const [result, setResult] = useState<GrammarExplanation | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAskAI = async () => {
        if (!query.trim()) return;

        if (!currentUser?.isVip || !currentUser?.email) {
            setResult(geminiService.sampleGrammarExplanation);
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await geminiService.explainGrammarPoint(query);
            if (response) {
                setResult(response);
                await gamificationService.addXp(15);
            } else {
                setError("Gia sư AI không thể trả lời câu hỏi này. Vui lòng thử diễn đạt khác.");
            }
        } catch (e) {
            setError("Đã xảy ra lỗi khi kết nối với Gia sư AI. Vui lòng thử lại sau.");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
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

    const handleAddToSrs = async () => {
        if (!result || !currentUser?.email) return;
        const vocabItem: VocabItem = {
            word: result.grammar_point,
            romanization: '',
            meaning: result.explanation.substring(0, 100) + '...', // Truncate for display
            partOfSpeech: 'Ngữ pháp',
            example_sentence: result.examples[0]?.korean || '',
            example_translation: result.examples[0]?.vietnamese || '',
        };
        const count = await srsService.addWordsToDeck([vocabItem]);
        if (count > 0) {
            addToast({ type: 'success', title: 'Đã thêm!', message: `"${vocabItem.word}" đã được thêm vào bộ ôn tập.` });
            await gamificationService.addXp(5);
            await gamificationService.checkSrsBadges();
        } else {
            addToast({ type: 'info', title: 'Đã có', message: `"${vocabItem.word}" đã có trong bộ ôn tập của bạn.` });
        }
    };
    
    const handleReset = () => {
        setQuery('');
        setResult(null);
        setError(null);
    }

    return (
        <div className="max-w-4xl mx-auto">
            <FeatureHeader
                title="Gia sư Ngữ pháp AI"
                description="Hỏi bất cứ điều gì về ngữ pháp tiếng Hàn và nhận câu trả lời chi tiết ngay lập tức."
            />

            {!currentUser?.isVip && <UpgradeToVipPrompt featureName="Gia sư Ngữ pháp AI không giới hạn" setActiveFeature={setActiveFeature as any} />}

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                <textarea
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Hỏi bất cứ điều gì về ngữ pháp tiếng Hàn...&#10;Ví dụ: 'Khi nào dùng -은/는 và -이/가?'"
                    className="w-full h-24 p-3 border-2 border-slate-300 dark:border-slate-600 rounded-lg resize-none focus:ring-2 focus:ring-hanguk-blue-500 focus:border-hanguk-blue-500 transition-all-base"
                    rows={3}
                />
                <div className="mt-4 flex justify-end">
                    {result && <button onClick={handleReset} className="px-6 py-2 bg-slate-200 dark:bg-slate-600 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 mr-2">Hỏi câu khác</button>}
                    <button
                        onClick={handleAskAI}
                        disabled={isLoading || !query.trim()}
                        className="px-6 py-2 bg-hanguk-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-hanguk-blue-700 disabled:bg-slate-400 flex items-center gap-2"
                    >
                        {isLoading ? <><Loader /> Đang phân tích...</> : <><SparklesIcon small /> Hỏi AI</>}
                    </button>
                </div>
            </div>

            {error && <p className="mt-4 text-center text-red-500">{error}</p>}
            
            {isLoading && !result && <div className="mt-6 flex justify-center"><Loader /></div>}

            {result ? (
                <div className="mt-6 bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 animate-fade-in-up space-y-4">
                    <div className="flex justify-between items-start pb-3 border-b border-slate-200 dark:border-slate-700">
                        <h2 className="text-2xl font-bold text-hanguk-blue-800 dark:text-hanguk-blue-300">{result.grammar_point}</h2>
                        <button onClick={handleAddToSrs} className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-md hover:bg-green-700">
                            <PlusIcon small /> Thêm vào SRS
                        </button>
                    </div>

                    <div>
                        <h4 className="font-semibold text-slate-700 dark:text-slate-200">Giải thích</h4>
                        <p className="mt-1 text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{result.explanation}</p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-slate-700 dark:text-slate-200">Ví dụ</h4>
                        <ul className="mt-2 space-y-3">
                            {result.examples.map((ex, i) => (
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
                                        <button onClick={() => speak(ex.korean)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600" title="Nghe">
                                            <SpeakerIcon small />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {result.common_mistakes && (
                        <div>
                             <h4 className="font-semibold text-slate-700 dark:text-slate-200">Lỗi thường gặp</h4>
                             <div className="mt-1 p-3 bg-yellow-100 dark:bg-yellow-900/50 rounded-md text-sm text-yellow-800 dark:text-yellow-200 flex items-start gap-2">
                                <LightbulbIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <p>{result.common_mistakes}</p>
                             </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="mt-6 text-center text-slate-500 dark:text-slate-400">
                    <h4 className="font-semibold mb-2">Gợi ý câu hỏi:</h4>
                    <div className="flex flex-col items-center gap-2">
                        {exampleQuestions.map(q => (
                             <button key={q} onClick={() => setQuery(q)} className="px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded-full text-sm hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                                "{q}"
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GrammarHelper;