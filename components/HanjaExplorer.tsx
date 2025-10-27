import React, { useState, useMemo, useCallback } from 'react';
import { hanjaData } from '../services/hanjaData';
import * as geminiService from '../services/geminiService';
import * as srsService from '../services/srsService';
import * as gamificationService from '../services/gamificationService';
import { useAuth } from '../contexts/AuthContext';
import type { HanjaLevel, HanjaChar, HanjaExampleWord, VocabItem, HanjaMindMap } from '../types';
import FeatureHeader from './FeatureHeader';
import Loader from './Loader';
import { CloseIcon, PlusIcon, SparklesIcon, CheckIcon, ClipboardDocumentIcon } from './icons/Icons';
import { useToast } from '../contexts/ToastContext';

type FilterMode = 'level' | 'stroke' | 'radical';

const HanjaExplorer: React.FC = () => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const [data] = useState<HanjaLevel[]>(hanjaData);
    const [filterMode, setFilterMode] = useState<FilterMode>('level');
    const [activeLevel, setActiveLevel] = useState<HanjaLevel['levelId']>('beginner');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedChar, setSelectedChar] = useState<HanjaChar | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiWords, setAiWords] = useState<HanjaExampleWord[]>([]);
    
    // Mind Map State
    const [mindMapData, setMindMapData] = useState<HanjaMindMap | null>(null);
    const [isGeneratingMindMap, setIsGeneratingMindMap] = useState(false);
    
    const [addedWords, setAddedWords] = useState<Set<string>>(new Set());

    const displayData = useMemo(() => {
        const allChars = data.flatMap(level => level.chars);
        
        const filterChars = (chars: HanjaChar[]) => {
            if (!searchTerm.trim()) return chars;
            const lowercasedTerm = searchTerm.toLowerCase();
            return chars.filter(char =>
                char.char.includes(lowercasedTerm) ||
                char.reading.toLowerCase().includes(lowercasedTerm) ||
                char.meaning.toLowerCase().includes(lowercasedTerm)
            );
        };

        if (filterMode === 'level') {
            const levelData = data.find(l => l.levelId === activeLevel);
            return filterChars(levelData?.chars || []);
        }

        const groupBy = (key: 'strokeCount' | 'radical') => {
            return allChars.reduce((acc, char) => {
                const groupKey = key === 'radical' ? char.radical.split(' ')[0] : String(char[key]);
                if (!acc[groupKey]) {
                    acc[groupKey] = [];
                }
                acc[groupKey].push(char);
                return acc;
            }, {} as Record<string, HanjaChar[]>);
        };

        const groupedData = filterMode === 'stroke' ? groupBy('strokeCount') : groupBy('radical');
        
        // Filter within groups
        Object.keys(groupedData).forEach(key => {
            groupedData[key] = filterChars(groupedData[key]);
            if(groupedData[key].length === 0) {
                delete groupedData[key];
            }
        });
        return groupedData;

    }, [data, activeLevel, searchTerm, filterMode]);


    const openModal = (char: HanjaChar) => {
        setSelectedChar(char);
        setAiWords([]);
        setMindMapData(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        // Delay clearing to allow for fade-out animation
        setTimeout(() => setSelectedChar(null), 300);
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

    const handleGetMoreWords = async () => {
        if (!selectedChar || !currentUser?.email) return;
        if (!currentUser?.isVip) {
            addToast({ type: 'warning', title: 'Tính năng VIP', message: 'Tìm thêm từ vựng với AI là tính năng VIP.' });
            return;
        }
        setIsAiLoading(true);
        const result = await geminiService.getMoreHanjaWords(selectedChar.char, selectedChar.reading, selectedChar.meaning);
        if (result) {
            setAiWords(result);
            await gamificationService.addXp(10);
        } else {
            addToast({ type: 'error', title: 'Lỗi', message: 'Không thể tạo thêm từ vựng. Vui lòng thử lại.'});
        }
        setIsAiLoading(false);
    };

    const handleGenerateMindMap = async () => {
        if (!selectedChar || !currentUser?.email) return;

        setIsGeneratingMindMap(true);
        setMindMapData(null);
        
        const { mindMap, isSuccess, errorMessage } = await geminiService.generateHanjaMindMap(selectedChar.char, selectedChar.reading, selectedChar.meaning);

        if (isSuccess && mindMap) {
            setMindMapData(mindMap);
            if(currentUser.isVip) await gamificationService.addXp(15);
        } else {
            addToast({ type: 'error', title: 'Lỗi', message: errorMessage || 'Không thể tạo sơ đồ. Dữ liệu mẫu đã được tải.' });
            setMindMapData(geminiService.sampleHanjaMindMap);
        }
        setIsGeneratingMindMap(false);
    };
    
    const handleAddToSrs = async (item: HanjaExampleWord | HanjaChar) => {
        if (!currentUser?.email) return;
        const vocabItem: VocabItem = 'hangeul' in item
            ? {
                word: item.hangeul,
                romanization: item.romanization,
                meaning: item.meaning,
                partOfSpeech: `Hanja (${item.hanja})`,
                example_sentence: '',
                example_translation: '',
              }
            : {
                word: item.char,
                romanization: item.reading,
                meaning: item.meaning,
                partOfSpeech: 'Hanja',
                example_sentence: item.examples[0]?.hangeul || '',
                example_translation: item.examples[0]?.meaning || '',
              };

        const count = await srsService.addWordsToDeck([vocabItem]);
        if (count > 0) {
            addToast({ type: 'success', title: 'Đã thêm!', message: `"${vocabItem.word}" đã được thêm vào bộ ôn tập.` });
            await gamificationService.addXp(2);
            await gamificationService.checkSrsBadges();
            setAddedWords(prev => new Set(prev).add(vocabItem.word));
            setTimeout(() => {
                setAddedWords(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(vocabItem.word);
                    return newSet;
                });
            }, 2000);
        } else {
            addToast({ type: 'info', title: 'Đã có', message: `"${vocabItem.word}" đã có trong bộ ôn tập của bạn.` });
        }
    };
    
    const renderGrid = (chars: HanjaChar[]) => (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {chars.map((char, index) => (
                <button
                    key={index}
                    onClick={() => openModal(char)}
                    className="aspect-square bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-2 text-center transition-transform hover:scale-105 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-hanguk-blue-500"
                >
                    <span className="text-4xl font-serif">{char.char}</span>
                    <span className="font-bold text-hanguk-blue-700 dark:text-hanguk-blue-300 mt-1">{char.reading}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{char.meaning}</span>
                </button>
            ))}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <FeatureHeader
                title="Khám phá Hanja (Hán tự)"
                description="Tìm hiểu các ký tự Hán-Hàn phổ biến để mở rộng vốn từ vựng của bạn."
            />

            <div className="sticky top-0 z-10 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-sm pt-4 pb-2 -my-4">
                <div className="mb-4 border-b-2 border-slate-200 dark:border-slate-700">
                     {(['level', 'stroke', 'radical'] as FilterMode[]).map(mode => (
                        <button 
                            key={mode}
                            onClick={() => setFilterMode(mode)}
                            className={`px-4 py-2 font-semibold text-sm transition-colors ${filterMode === mode ? 'border-b-2 border-hanguk-blue-600 text-hanguk-blue-600 dark:text-hanguk-blue-300' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                        >
                            {mode === 'level' ? 'Cấp độ' : mode === 'stroke' ? 'Số nét' : 'Bộ thủ'}
                        </button>
                    ))}
                </div>
                {filterMode === 'level' && (
                     <div className="mb-4 flex gap-1 p-1 bg-slate-200 dark:bg-slate-700 rounded-lg">
                        {data.map(level => (
                            <button 
                                key={level.levelId}
                                onClick={() => setActiveLevel(level.levelId)}
                                className={`flex-1 px-4 py-1.5 rounded-md font-semibold text-sm transition-colors ${activeLevel === level.levelId ? 'bg-white dark:bg-slate-800 text-hanguk-blue-600 shadow' : 'text-slate-600 dark:text-slate-300'}`}
                            >
                                {level.levelName}
                            </button>
                        ))}
                    </div>
                )}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Tìm Hanja, âm Hán-Hàn, hoặc nghĩa..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full p-3 pl-10 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                    />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <div className="mt-8 space-y-8">
                {Array.isArray(displayData) ? (
                     displayData.length > 0 ? renderGrid(displayData) : <p className="text-center text-slate-500">Không có kết quả.</p>
                ) : (
                    Object.keys(displayData).length > 0 ? (
                        Object.keys(displayData).sort((a, b) => filterMode === 'stroke' ? Number(a) - Number(b) : a.localeCompare(b)).map(groupKey => (
                            <div key={groupKey}>
                                <h3 className="text-lg font-bold mb-3 pb-2 border-b border-slate-200 dark:border-slate-700">
                                    {filterMode === 'stroke' ? `${groupKey} Nét` : groupKey}
                                </h3>
                                {renderGrid(displayData[groupKey])}
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-slate-500">Không có kết quả.</p>
                    )
                )}
            </div>

            {isModalOpen && selectedChar && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-modal-backdrop" onClick={closeModal}>
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col animate-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
                            <h2 className="text-2xl font-bold">{selectedChar.meaning}</h2>
                            <button onClick={closeModal} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"><CloseIcon /></button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <div className="flex items-center gap-6 mb-6">
                                <div className="text-center">
                                    <p className="text-8xl font-serif text-hanguk-blue-800 dark:text-hanguk-blue-300">{selectedChar.char}</p>
                                    <p className="text-3xl font-bold">{selectedChar.reading}</p>
                                </div>
                                <div className="flex-grow grid grid-cols-2 gap-4 text-center">
                                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Số nét</p>
                                        <p className="text-2xl font-bold">{selectedChar.strokeCount}</p>
                                    </div>
                                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Bộ thủ</p>
                                        <p className="text-2xl font-bold">{selectedChar.radical.split(' ')[0]}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-semibold">Ví dụ cơ bản:</h4>
                                        <button onClick={() => handleAddToSrs(selectedChar)} className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white text-xs font-bold rounded-md hover:bg-green-700">
                                            {addedWords.has(selectedChar.char) ? <CheckIcon small /> : <PlusIcon small />}
                                            {addedWords.has(selectedChar.char) ? ' Đã thêm' : ' Thêm ký tự'}
                                        </button>
                                    </div>
                                    <ul className="space-y-2">
                                        {(selectedChar.examples || []).map((ex, i) => (
                                            <li key={i} className="flex justify-between items-center p-2 bg-slate-100 dark:bg-slate-700 rounded-md">
                                                <div className="group flex items-center gap-2">
                                                    <p className="font-bold">{ex.hangeul} <span className="font-serif text-slate-500">({ex.hanja})</span></p>
                                                    <button onClick={() => handleCopy(ex.hangeul)} className="p-1 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-200 dark:hover:bg-slate-600"><ClipboardDocumentIcon small/></button>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">- {ex.meaning}</p>
                                                </div>
                                                <button onClick={() => handleAddToSrs(ex)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600" title="Thêm vào SRS">
                                                    {addedWords.has(ex.hangeul) ? <CheckIcon className="text-green-500" small /> : <PlusIcon small />}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                
                                {currentUser?.isVip && (
                                <div>
                                    <button onClick={handleGetMoreWords} disabled={isAiLoading} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-hanguk-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-hanguk-blue-700 disabled:bg-slate-400">
                                        {isAiLoading ? <Loader /> : <SparklesIcon small />}
                                        {isAiLoading ? 'AI đang tìm...' : 'Tìm thêm từ vựng với AI'}
                                    </button>
                                </div>
                                )}
                                
                                {aiWords.length > 0 && (
                                    <div className="animate-fade-in">
                                        <h4 className="font-semibold mb-2">Ví dụ mở rộng từ AI:</h4>
                                        <ul className="space-y-2">
                                            {aiWords.map((ex, i) => (
                                                <li key={i} className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-900/50 rounded-md">
                                                   <div className="group flex items-center gap-2">
                                                        <p className="font-bold">{ex.hangeul} <span className="font-serif text-slate-500">({ex.hanja})</span></p>
                                                        <button onClick={() => handleCopy(ex.hangeul)} className="p-1 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-100 dark:hover:bg-blue-800"><ClipboardDocumentIcon small/></button>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400">- {ex.meaning}</p>
                                                    </div>
                                                    <button onClick={() => handleAddToSrs(ex)} className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800" title="Thêm vào SRS">
                                                        {addedWords.has(ex.hangeul) ? <CheckIcon className="text-green-500" small /> : <PlusIcon small />}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                
                                <div className="pt-4 border-t border-slate-200 dark:border-slate-600">
                                     <button onClick={handleGenerateMindMap} disabled={isGeneratingMindMap} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-hanguk-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-hanguk-blue-700 disabled:bg-slate-400">
                                        {isGeneratingMindMap ? <Loader /> : <SparklesIcon small />}
                                        {isGeneratingMindMap ? 'AI đang vẽ...' : 'Tạo Sơ đồ Tư duy AI'}
                                    </button>
                                    
                                    {isGeneratingMindMap && <div className="flex justify-center mt-4"><Loader/></div>}

                                    {mindMapData && (
                                        <div className="mt-6 relative w-full aspect-square animate-fade-in">
                                            {/* Central Node */}
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 p-4 bg-hanguk-blue-200 dark:bg-hanguk-blue-800 rounded-full flex flex-col items-center justify-center w-32 h-32 text-center shadow-lg">
                                                <span className="text-3xl font-serif">{mindMapData.root.char}</span>
                                                <span className="font-bold">{mindMapData.root.reading}</span>
                                                <span className="text-xs">{mindMapData.root.meaning}</span>
                                            </div>
                                            {/* Branch Nodes and Lines */}
                                            {mindMapData.nodes.map((node, i) => {
                                                const nodeCount = mindMapData.nodes.length;
                                                const angle = (i / nodeCount) * 2 * Math.PI - (Math.PI / 2); // Start from top
                                                const radius = 38; // Percentage from center
                                                const x = 50 + radius * Math.cos(angle);
                                                const y = 50 + radius * Math.sin(angle);
                                                const lineAngleDeg = angle * 180 / Math.PI;

                                                return (
                                                    <React.Fragment key={i}>
                                                        {/* Line */}
                                                        <div 
                                                            className="absolute top-1/2 left-1/2 h-px bg-slate-300 dark:bg-slate-600 z-10"
                                                            style={{
                                                                width: `${radius}%`,
                                                                transformOrigin: 'left center',
                                                                transform: `rotate(${lineAngleDeg}deg)`,
                                                                animation: `line-draw-width 0.4s ${i * 0.08}s ease-out forwards`,
                                                            }}
                                                        />
                                                        {/* Node */}
                                                        <div 
                                                            className="absolute p-3 bg-white dark:bg-slate-700 shadow-md text-center flex flex-col justify-center items-center transition-transform hover:scale-110 z-20"
                                                            style={{ 
                                                                top: `${y}%`, 
                                                                left: `${x}%`,
                                                                transform: 'translate(-50%, -50%)',
                                                                minWidth: '90px',
                                                                maxWidth: '110px',
                                                                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                                                                animation: `fadeInUp 0.5s ${i * 0.08 + 0.2}s ease-out forwards`,
                                                                opacity: 0,
                                                            }}>
                                                            <p className="font-bold text-sm" style={{ wordBreak: 'keep-all' }}>{node.hangeul}</p>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">{node.vietnamese}</p>
                                                        </div>
                                                    </React.Fragment>
                                                );
                                            })}
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HanjaExplorer;