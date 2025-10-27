import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { commonPhrases, PhraseCategory, Phrase } from '../services/phraseData';
import type { VocabItem } from '../types';
import FeatureHeader from './FeatureHeader';
import { SpeakerIcon, PlusIcon, SparklesIcon, CheckIcon, ClipboardDocumentIcon } from './icons/Icons';
import * as srsService from '../services/srsService';
import * as gamificationService from '../services/gamificationService';
import { speak } from '../services/ttsService';
import { useSelectionPopover } from '../contexts/SelectionPopoverContext';
import { useToast } from '../contexts/ToastContext';
import * as geminiService from '../services/geminiService';
import * as learningHistoryService from '../services/learningHistoryService';
import { useAuth } from '../contexts/AuthContext';
import Loader from './Loader';

const CommonPhrases: React.FC = () => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const [categories] = useState<PhraseCategory[]>(commonPhrases);
    const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.category || '');
    const [searchTerm, setSearchTerm] = useState('');
    const [addedPhrases, setAddedPhrases] = useState<Set<string>>(new Set());
    const contentRef = useRef<HTMLDivElement>(null);
    const { showPopover } = useSelectionPopover();
    
    // AI Feature State
    const [aiQuery, setAiQuery] = useState('');
    const [generatedPhrases, setGeneratedPhrases] = useState<Phrase[] | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleSelection = useCallback(() => {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed || !contentRef.current) return;
        
        if (!contentRef.current.contains(selection.anchorNode)) {
            return;
        }

        const text = selection.toString().trim();
        if (text && selection.rangeCount > 0) {
            let parent = selection.anchorNode?.parentElement;
            while(parent && parent !== contentRef.current) {
                if (parent.dataset.selectable) {
                    const range = selection.getRangeAt(0);
                    if (range.getBoundingClientRect().width > 5) {
                        showPopover(text, range.getBoundingClientRect());
                    }
                    return;
                }
                parent = parent.parentElement;
            }
        }
    }, [showPopover]);

    useEffect(() => {
        document.addEventListener('mouseup', handleSelection);
        return () => document.removeEventListener('mouseup', handleSelection);
    }, [handleSelection]);

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

    const handleAddToSrs = async (phrase: { korean: string; romanization: string; vietnamese: string; }) => {
        if (!currentUser?.email) return;
        const vocabItem: VocabItem = {
            word: phrase.korean,
            romanization: phrase.romanization,
            meaning: phrase.vietnamese,
            partOfSpeech: 'Cụm từ',
            example_sentence: phrase.korean,
            example_translation: phrase.vietnamese,
        };
        const count = await srsService.addWordsToDeck([vocabItem]);
        if (count > 0) {
            await learningHistoryService.addHistoryItem('phrase', phrase);
            addToast({ type: 'success', title: 'Đã thêm!', message: `"${vocabItem.word}" đã được thêm vào bộ ôn tập.` });
            await gamificationService.addXp(5); // Award some XP
            await gamificationService.checkSrsBadges();
            setAddedPhrases(prev => new Set(prev).add(phrase.korean));
            setTimeout(() => {
                setAddedPhrases(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(phrase.korean);
                    return newSet;
                });
            }, 2000);
        } else {
            addToast({ type: 'info', title: 'Đã có', message: `"${vocabItem.word}" đã có trong bộ ôn tập của bạn.` });
        }
    };

    const handleGeneratePhrases = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser?.isVip || !currentUser?.email) {
            addToast({ type: 'warning', title: 'Tính năng VIP', message: 'Tạo cụm từ bằng AI là tính năng VIP.' });
            return;
        }
        setIsGenerating(true);
        setGeneratedPhrases(null);
        try {
            const result = await geminiService.generatePhrasesForSituation(aiQuery);
            setGeneratedPhrases(result);
            await gamificationService.addXp(15);
        } catch (error) {
            console.error(error);
            addToast({type: 'error', title: 'Lỗi', message: 'Không thể tạo cụm từ. Vui lòng thử lại.'});
        } finally {
            setIsGenerating(false);
        }
    };

    const filteredPhrases = useMemo(() => {
        const phrasesByCategory = categories.find(c => c.category === activeCategory)?.phrases || [];
        if (!searchTerm) {
            return phrasesByCategory;
        }
        const lowercasedTerm = searchTerm.toLowerCase();
        return phrasesByCategory.filter(phrase =>
            phrase.korean.toLowerCase().includes(lowercasedTerm) ||
            phrase.romanization.toLowerCase().includes(lowercasedTerm) ||
            phrase.vietnamese.toLowerCase().includes(lowercasedTerm)
        );
    }, [categories, activeCategory, searchTerm]);

    const handleCategoryChange = (category: string) => {
        setActiveCategory(category);
        setSearchTerm(''); // Reset search when category changes
    };

    return (
        <div className="max-w-4xl mx-auto">
            <FeatureHeader
                title="Cụm từ thông dụng"
                description="Học các câu giao tiếp cần thiết cho các tình huống hàng ngày."
            />
            
            <div className="mb-8 p-6 bg-hanguk-blue-50 dark:bg-hanguk-blue-900/50 rounded-lg shadow-md border border-hanguk-blue-200 dark:border-hanguk-blue-800">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-slate-800 dark:text-slate-100">
                    <SparklesIcon /> Tạo Cụm từ theo Tình huống (AI)
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Không tìm thấy thứ bạn cần? Hãy mô tả tình huống của bạn và để AI tạo ra các cụm từ phù hợp.
                </p>
                <form onSubmit={handleGeneratePhrases} className="flex flex-col sm:flex-row gap-2">
                    <input
                        type="text"
                        value={aiQuery}
                        onChange={e => setAiQuery(e.target.value)}
                        placeholder="Ví dụ: hỏi đường đến bưu điện, đặt trà sữa trân châu..."
                        className="flex-grow p-3 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                    />
                    <button type="submit" disabled={isGenerating || !aiQuery.trim()} className="px-6 py-3 bg-hanguk-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-hanguk-blue-700 disabled:bg-slate-400 flex items-center justify-center gap-2">
                        {isGenerating ? <Loader /> : null}
                        {isGenerating ? 'Đang tạo...' : 'Tạo'}
                    </button>
                </form>
            </div>
            
            {generatedPhrases && (
                <div className="mb-8 animate-fade-in">
                    <h3 className="text-xl font-bold mb-3">Kết quả từ AI cho: "{aiQuery}"</h3>
                    <div className="space-y-3">
                        {generatedPhrases.map((phrase, index) => (
                             <div key={`ai-${index}`} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border-l-4 border-hanguk-blue-400">
                                <div className="flex justify-between items-start">
                                    <div className="flex-grow space-y-1">
                                        <div className="group flex items-center gap-2">
                                            <p data-selectable="true" className="font-bold text-lg text-slate-800 dark:text-slate-200">{phrase.korean}</p>
                                            <button onClick={() => handleCopy(phrase.korean)} className="p-1 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-200 dark:hover:bg-slate-600"><ClipboardDocumentIcon small/></button>
                                        </div>
                                        <div className="group flex items-center gap-2">
                                            <p className="text-md text-cyan-600 dark:text-cyan-400 italic break-all">{phrase.romanization}</p>
                                            <button onClick={() => handleCopy(phrase.romanization)} className="p-1 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-200 dark:hover:bg-slate-600"><ClipboardDocumentIcon small/></button>
                                        </div>
                                        <div className="group flex items-center gap-2">
                                            <p className="text-md text-slate-500 dark:text-slate-400 mt-1">"{phrase.vietnamese}"</p>
                                            <button onClick={() => handleCopy(phrase.vietnamese)} className="p-1 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-200 dark:hover:bg-slate-600"><ClipboardDocumentIcon small/></button>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 flex items-center gap-2 ml-2">
                                        <button onClick={() => speak(phrase.korean)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600" title="Nghe">
                                            <SpeakerIcon small />
                                        </button>
                                        <button onClick={() => handleAddToSrs(phrase)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600" title="Thêm vào SRS">
                                            {addedPhrases.has(phrase.korean) ? <CheckIcon className="text-green-500" small/> : <PlusIcon small />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}


            <div className="mb-6 flex flex-wrap gap-2 p-1 bg-slate-200 dark:bg-slate-700 rounded-lg">
                {categories.map(cat => (
                    <button
                        key={cat.category}
                        onClick={() => handleCategoryChange(cat.category)}
                        className={`px-4 py-1.5 rounded-md font-semibold text-sm transition-colors ${activeCategory === cat.category ? 'bg-white dark:bg-slate-800 text-hanguk-blue-600 shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/50'}`}
                    >
                        {cat.category}
                    </button>
                ))}
            </div>

            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm cụm từ (Hàn, Việt, Romanization)..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full p-3 pl-10 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                />
                 <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            <div className="space-y-3" ref={contentRef}>
                {filteredPhrases.length > 0 ? (
                    filteredPhrases.map((phrase, index) => (
                        <div key={index} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm animate-fade-in">
                            <div className="flex justify-between items-start">
                                 <div className="flex-grow space-y-1">
                                    <div className="group flex items-center gap-2">
                                        <p data-selectable="true" className="font-bold text-lg text-slate-800 dark:text-slate-200">{phrase.korean}</p>
                                        <button onClick={() => handleCopy(phrase.korean)} className="p-1 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-200 dark:hover:bg-slate-600"><ClipboardDocumentIcon small/></button>
                                    </div>
                                    <div className="group flex items-center gap-2">
                                        <p className="text-md text-cyan-600 dark:text-cyan-400 italic break-all">{phrase.romanization}</p>
                                        <button onClick={() => handleCopy(phrase.romanization)} className="p-1 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-200 dark:hover:bg-slate-600"><ClipboardDocumentIcon small/></button>
                                    </div>
                                    <div className="group flex items-center gap-2">
                                        <p className="text-md text-slate-500 dark:text-slate-400 mt-1">"{phrase.vietnamese}"</p>
                                        <button onClick={() => handleCopy(phrase.vietnamese)} className="p-1 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-200 dark:hover:bg-slate-600"><ClipboardDocumentIcon small/></button>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 flex items-center gap-2 ml-2">
                                    <button onClick={() => speak(phrase.korean)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600" title="Nghe">
                                        <SpeakerIcon small />
                                    </button>
                                    <button onClick={() => handleAddToSrs(phrase)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600" title="Thêm vào SRS">
                                        {addedPhrases.has(phrase.korean) ? <CheckIcon className="text-green-500" small/> : <PlusIcon small />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                        <p>Không tìm thấy cụm từ nào khớp với tìm kiếm của bạn.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommonPhrases;