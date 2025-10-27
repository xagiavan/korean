import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import type { AppFeatureProps, BilingualStory, BilingualStorySegment, VocabItem } from '../types';
import FeatureHeader from './FeatureHeader';
import { useAuth } from '../contexts/AuthContext';
import * as geminiService from '../services/geminiService';
import StoryGenerationLoader from './StoryGenerationLoader';
import { SparklesIcon, PlusIcon, InformationCircleIcon, SlidersHorizontalIcon, CheckIcon, ClipboardDocumentIcon } from './icons/Icons';
import * as srsService from '../services/srsService';
import * as gamificationService from '../services/gamificationService';
import { useToast } from '../contexts/ToastContext';
import UpgradeToVipPrompt from './UpgradeToVipPrompt';

const genres = ['Phiêu lưu', 'Hài kịch', 'Đời thường', 'Lãng mạn', 'Bí ẩn', 'Cổ tích'];
const difficulties = [
    { id: 'beginner', name: 'Sơ cấp' },
    { id: 'intermediate', name: 'Trung cấp' },
    { id: 'advanced', name: 'Cao cấp' }
];

interface StorySettings {
  fontSize: 'sm' | 'base' | 'lg';
  wordSpacing: boolean;
  highlightColor: 'blue' | 'green' | 'orange';
}

const SETTINGS_KEY = 'koreanStoryTimeSettings';

const defaultSettings: StorySettings = {
  fontSize: 'base',
  wordSpacing: false,
  highlightColor: 'blue',
};

const colorThemes: Record<StorySettings['highlightColor'], string> = {
  blue: 'bg-hanguk-blue-100 dark:bg-hanguk-blue-900/70 text-hanguk-blue-800 dark:text-hanguk-blue-300',
  green: 'bg-green-100 dark:bg-green-900/70 text-green-800 dark:text-green-300',
  orange: 'bg-orange-100 dark:bg-orange-900/70 text-orange-800 dark:text-orange-300',
};


const StoryTime: React.FC<AppFeatureProps> = ({ setActiveFeature }) => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const [genre, setGenre] = useState('Đời thường');
    const [plot, setPlot] = useState('');
    const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
    const [story, setStory] = useState<BilingualStory | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const storyContainerRef = useRef<HTMLDivElement>(null);
    const [addedWords, setAddedWords] = useState<Set<string>>(new Set());
    
    // UI Customization State
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [settings, setSettings] = useState<StorySettings>(() => {
        try {
            const saved = localStorage.getItem(SETTINGS_KEY);
            return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
        } catch {
            return defaultSettings;
        }
    });

    // Save settings to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        } catch (error) {
            console.error("Could not save story settings:", error);
        }
    }, [settings]);


    const handleGenerateStory = useCallback(async () => {
        if (!plot.trim()) {
            addToast({ type: 'warning', title: 'Thiếu ý tưởng', message: 'Vui lòng nhập một ý tưởng cho cốt truyện.' });
            return;
        }
        
        setIsLoading(true);
        setStory(null);
        setApiError(null);

        if (!currentUser?.isVip || !currentUser?.email) {
            setStory(geminiService.sampleBilingualStory);
            setIsLoading(false);
            return;
        }

        const { story: newStory, isSuccess, errorMessage } = await geminiService.generateBilingualStory(genre, plot, difficulty);
        if (isSuccess) {
            setStory(newStory);
            await gamificationService.addXp(50);
        } else {
            setStory(geminiService.sampleBilingualStory);
            setApiError(errorMessage || 'Không thể tạo truyện. Vui lòng thử lại.');
        }

        setIsLoading(false);
    }, [genre, plot, difficulty, currentUser, addToast]);
    
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

    const handleAddToSrs = async (segment: BilingualStorySegment) => {
        if (!currentUser?.email) return;
        const vocabItem: VocabItem = {
            word: segment.text,
            romanization: segment.romanization || '',
            meaning: segment.meaning || '',
            partOfSpeech: 'Từ vựng',
            example_sentence: segment.example_sentence || '',
            example_translation: segment.example_translation || '',
        };
        const count = await srsService.addWordsToDeck([vocabItem]);
        if (count > 0) {
            addToast({ type: 'success', title: 'Đã thêm!', message: `"${vocabItem.word}" đã được thêm vào bộ ôn tập.` });
            await gamificationService.addXp(5);
            await gamificationService.checkSrsBadges();
            setAddedWords(prev => new Set(prev).add(segment.text));
            setTimeout(() => {
                setAddedWords(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(segment.text);
                    return newSet;
                });
            }, 2000);
        } else {
            addToast({ type: 'info', title: 'Đã có', message: `"${vocabItem.word}" đã có trong bộ ôn tập của bạn.` });
        }
    };

    const uniqueVocabList = useMemo(() => {
        if (!story) return [];
        const allKoreanSegments = story.content.flat().filter(seg => seg.type === 'korean');
        const uniqueVocabMap = new Map(allKoreanSegments.map(seg => [seg.text, seg]));
        return Array.from(uniqueVocabMap.values());
    }, [story]);
    
    if (isLoading) {
        return <StoryGenerationLoader />;
    }

    if (story) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => setStory(null)} className="text-sm font-semibold text-hanguk-blue-600 dark:text-hanguk-blue-400 hover:underline">
                        &larr; Quay lại để tạo truyện mới
                    </button>
                    <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-200 dark:bg-slate-700 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                        <SlidersHorizontalIcon small/> Tùy chỉnh
                    </button>
                </div>
                
                {isSettingsOpen && (
                    <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg mb-4 animate-fade-in space-y-4">
                        <h3 className="font-bold text-lg">Tùy chỉnh Giao diện</h3>
                        {/* Font Size */}
                        <div>
                            <label className="font-semibold text-sm">Cỡ chữ</label>
                            <div className="mt-1 flex gap-2">
                                {(['sm', 'base', 'lg'] as const).map(size => (
                                    <button key={size} onClick={() => setSettings(s => ({...s, fontSize: size}))} className={`px-4 py-1.5 rounded-md font-semibold text-sm transition-colors ${settings.fontSize === size ? 'bg-white dark:bg-slate-800 text-hanguk-blue-600 shadow' : ''}`}>
                                        {size === 'sm' ? 'Nhỏ' : size === 'base' ? 'Vừa' : 'Lớn'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Word Spacing */}
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="word-spacing" checked={settings.wordSpacing} onChange={e => setSettings(s => ({...s, wordSpacing: e.target.checked}))} className="rounded text-hanguk-blue-500" />
                            <label htmlFor="word-spacing" className="font-semibold text-sm">Tăng giãn cách từ tiếng Hàn</label>
                        </div>
                        {/* Highlight Color */}
                        <div>
                            <label className="font-semibold text-sm">Màu nhấn mạnh</label>
                            <div className="mt-1 flex gap-2">
                                {(['blue', 'green', 'orange'] as const).map(color => (
                                    <button key={color} onClick={() => setSettings(s => ({...s, highlightColor: color}))} className={`w-10 h-6 rounded-md ring-2 ring-offset-2 dark:ring-offset-slate-700 transition-all ${settings.highlightColor === color ? 'ring-hanguk-blue-500' : 'ring-transparent'} ${color === 'blue' ? 'bg-hanguk-blue-200' : color === 'green' ? 'bg-green-200' : 'bg-orange-200'}`}></button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div ref={storyContainerRef} className={`bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-md animate-fade-in text-${settings.fontSize}`}>
                    <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">{story.title}</h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
                        {story.content.map((paragraph, pIndex) => (
                            <p key={pIndex} className="leading-relaxed">
                                {paragraph.map((segment, sIndex) => {
                                    if (segment.type === 'korean') {
                                        return (
                                            <span key={sIndex} className={`group relative inline-block cursor-pointer font-bold px-1.5 py-0.5 rounded-md mx-0.5 transition-all duration-200 ${colorThemes[settings.highlightColor]} ${settings.wordSpacing ? 'tracking-wider' : 'tracking-normal'}`}>
                                                {segment.text}
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-slate-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                    <strong className="text-base block">{segment.romanization}</strong>
                                                    <span className="block italic mb-2">"{segment.meaning}"</span>
                                                    <div className="text-xs text-slate-300 border-t border-slate-600 pt-2 mt-2 space-y-1">
                                                        <div className="font-semibold">Ví dụ:</div>
                                                        <div className="group/ex flex items-center gap-2">
                                                          <span>{segment.example_sentence}</span>
                                                          <button onClick={(e) => { e.stopPropagation(); handleCopy(segment.example_sentence || ''); }} className="p-1 rounded-full text-slate-400 opacity-0 group-hover/ex:opacity-100 transition-opacity hover:bg-slate-700 pointer-events-auto"><ClipboardDocumentIcon small/></button>
                                                        </div>
                                                        <div className="group/ex flex items-center gap-2">
                                                          <em className="flex-grow">"{segment.example_translation}"</em>
                                                          <button onClick={(e) => { e.stopPropagation(); handleCopy(segment.example_translation || ''); }} className="p-1 rounded-full text-slate-400 opacity-0 group-hover/ex:opacity-100 transition-opacity hover:bg-slate-700 pointer-events-auto"><ClipboardDocumentIcon small/></button>
                                                        </div>
                                                    </div>
                                                     <button onClick={(e) => { e.stopPropagation(); handleAddToSrs(segment); }} className="absolute top-1 right-1 p-1 bg-green-600 rounded-full text-white pointer-events-auto">
                                                        {addedWords.has(segment.text) ? <CheckIcon small/> : <PlusIcon small/>}
                                                    </button>
                                                </div>
                                            </span>
                                        );
                                    }
                                    return <span key={sIndex}>{segment.text}</span>;
                                })}
                            </p>
                        ))}
                    </div>
                </div>

                {uniqueVocabList.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-2xl font-bold mb-4">Từ vựng trong truyện</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {uniqueVocabList.map((vocab, index) => (
                                <div key={index} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-xl font-bold">{vocab.text}</h4>
                                            <p className="text-md italic text-slate-500">{vocab.romanization}</p>
                                            <p className="text-md font-semibold text-hanguk-blue-700 dark:text-hanguk-blue-300">{vocab.meaning}</p>
                                        </div>
                                        <button onClick={() => handleAddToSrs(vocab)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700" title="Thêm vào SRS">
                                            {addedWords.has(vocab.text) ? <CheckIcon className="text-green-500" /> : <PlusIcon />}
                                        </button>
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-600 text-sm text-slate-600 dark:text-slate-400">
                                        <p className="font-semibold">Ví dụ:</p>
                                        <div className="group flex items-center gap-2">
                                            <p className="flex-grow">{vocab.example_sentence}</p>
                                            <button onClick={() => handleCopy(vocab.example_sentence || '')} className="p-1 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-200 dark:hover:bg-slate-600"><ClipboardDocumentIcon small/></button>
                                        </div>
                                        <div className="group flex items-center gap-2">
                                            <p className="flex-grow">"{vocab.example_translation}"</p>
                                            <button onClick={() => handleCopy(vocab.example_translation || '')} className="p-1 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-200 dark:hover:bg-slate-600"><ClipboardDocumentIcon small/></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }


    return (
        <div className="max-w-2xl mx-auto">
            <FeatureHeader
                title="Kể chuyện AI"
                description="Tạo ra những câu chuyện song ngữ độc đáo để học từ vựng trong ngữ cảnh thú vị."
            />
            
            {!currentUser?.isVip && <UpgradeToVipPrompt featureName="tạo truyện không giới hạn" setActiveFeature={setActiveFeature as any} />}
            
            {apiError && (
                 <div className="my-4 p-4 bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-300 rounded-r-lg flex items-start gap-3">
                    <InformationCircleIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="font-bold">Đã xảy ra lỗi</p>
                        <p className="text-sm">{apiError} Dữ liệu mẫu đã được tải.</p>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md space-y-6">
                <div>
                    <label htmlFor="genre" className="block mb-2 font-semibold text-slate-700 dark:text-slate-200">1. Chọn thể loại</label>
                    <div className="flex flex-wrap gap-2">
                        {genres.map(g => (
                            <button key={g} onClick={() => setGenre(g)} className={`px-4 py-1.5 rounded-full font-semibold text-sm transition-colors ${genre === g ? 'bg-hanguk-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'}`}>
                                {g}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="plot" className="block mb-2 font-semibold text-slate-700 dark:text-slate-200">2. Nhập ý tưởng cốt truyện</label>
                    <textarea
                        id="plot"
                        value={plot}
                        onChange={e => setPlot(e.target.value)}
                        placeholder="Ví dụ: một chú mèo đi tìm con cá vàng biết nói, một người bạn từ Việt Nam lần đầu đến Seoul, một thám tử giải mã bí ẩn kim chi bị mất..."
                        className="w-full h-28 p-3 border-2 border-slate-300 dark:border-slate-600 rounded-lg resize-none"
                        rows={3}
                    />
                </div>
                 <div>
                    <label htmlFor="difficulty" className="block mb-2 font-semibold text-slate-700 dark:text-slate-200">3. Chọn độ khó</label>
                    <div className="flex flex-wrap gap-2">
                        {difficulties.map(d => (
                            <button key={d.id} onClick={() => setDifficulty(d.id as any)} className={`px-4 py-1.5 rounded-full font-semibold text-sm transition-colors ${difficulty === d.id ? 'bg-hanguk-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'}`}>
                                {d.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-700">
                     <button
                        onClick={handleGenerateStory}
                        disabled={isLoading}
                        className="px-8 py-3 bg-hanguk-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-hanguk-blue-700 disabled:bg-slate-400 flex items-center justify-center gap-2 w-full sm:w-auto mx-auto"
                    >
                        <SparklesIcon /> Tạo truyện
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StoryTime;