import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getTopikVocab, generateMnemonic, sampleTopikVocab } from '../services/geminiService';
import { xkldVocabData, type XkldVocabCategory } from '../services/xkldVocabData';
import type { VocabItem, Badge } from '../types';
import Loader from './Loader';
import FeatureHeader from './FeatureHeader';
import { useAuth } from '../contexts/AuthContext';
import UpgradeToVipPrompt from './UpgradeToVipPrompt';
import * as srsService from '../services/srsService';
import { PlusIcon, LightbulbIcon, InformationCircleIcon, CheckIcon, ClipboardDocumentIcon } from './icons/Icons';
import * as gamificationService from '../services/gamificationService';
import * as mnemonicService from '../services/mnemonicService';
import { useToast } from '../contexts/ToastContext';


type Feature = 'vocab';
type MainCategory = 'topik' | 'specialized';

interface TopikVocabProps {
  setActiveFeature: (feature: Feature) => void;
}

const TOPIK_LEVELS = ['1', '2', '3', '4', '5', '6'];

const TopikVocab: React.FC<TopikVocabProps> = ({ setActiveFeature }) => {
    const { currentUser } = useAuth();
    const { addToast, showBadgeCelebration } = useToast();
    const [mainCategory, setMainCategory] = useState<MainCategory>('topik');
    const [activeSubCategory, setActiveSubCategory] = useState<string>('1');

    const [vocabList, setVocabList] = useState<VocabItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [mnemonics, setMnemonics] = useState<Record<string, string>>({});
    const [loadingMnemonic, setLoadingMnemonic] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [apiError, setApiError] = useState<string | null>(null);
    const [addedWords, setAddedWords] = useState<Set<string>>(new Set());
    
    const specializedCategories: XkldVocabCategory[] = useMemo(() => xkldVocabData, []);

    useEffect(() => {
        const loadMnemonics = async () => {
            if (currentUser?.email) {
                const loadedMnemonics = await mnemonicService.getMnemonics();
                setMnemonics(loadedMnemonics);
            }
        };
        loadMnemonics();
    }, [currentUser]);

    useEffect(() => {
        if (mainCategory === 'topik') {
            setActiveSubCategory('1');
        } else {
            setActiveSubCategory(specializedCategories[0]?.id || '');
        }
    }, [mainCategory, specializedCategories]);

    const fetchVocab = useCallback(async (mCategory: MainCategory, subCategory: string) => {
        if (!subCategory) return;

        setIsLoading(true);
        setVocabList([]);
        setApiError(null);
        
        let data: VocabItem[] = [];
        if (mCategory === 'topik') {
            if (currentUser?.isVip) {
                const response = await getTopikVocab(subCategory);
                data = response.list;
                if (!response.isSuccess) {
                    setApiError(response.errorMessage || 'Đã xảy ra lỗi khi tải từ vựng.');
                }
            } else {
                data = sampleTopikVocab;
            }
        } else if (mCategory === 'specialized') {
            const categoryData = specializedCategories.find(c => c.id === subCategory);
            data = categoryData ? categoryData.words : [];
        }
        
        setVocabList(data);
        setIsLoading(false);
    }, [currentUser, specializedCategories]);

    useEffect(() => {
        fetchVocab(mainCategory, activeSubCategory);
    }, [mainCategory, activeSubCategory, fetchVocab]);

    const handleCategoryChange = (newCategory: string) => {
        setActiveSubCategory(newCategory);
        setSearchTerm('');
    };

    const handleGetMnemonic = async (item: VocabItem) => {
        if (!currentUser?.isVip || !currentUser.email) {
            addToast({ type: 'warning', title: 'Tính năng VIP', message: 'Tạo mẹo ghi nhớ là tính năng dành cho tài khoản VIP.' });
            return;
        }
        setLoadingMnemonic(item.word);
        const mnemonic = await generateMnemonic(item.word, item.meaning);
        
        await mnemonicService.saveMnemonic(item.word, mnemonic);

        setMnemonics(prev => ({ ...prev, [item.word]: mnemonic }));
        setLoadingMnemonic(null);
    };
    
    const handleAddSingleToSrs = async (item: VocabItem) => {
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

    const filteredVocabList = useMemo(() => {
        if (!searchTerm) return vocabList;
        const term = searchTerm.toLowerCase();
        return vocabList.filter(item => 
            item.word.toLowerCase().includes(term) ||
            item.meaning.toLowerCase().includes(term) ||
            item.romanization.toLowerCase().includes(term)
        );
    }, [vocabList, searchTerm]);
    
    const handleAddAllToSrs = async () => {
        if (!currentUser?.email) return;
        if (filteredVocabList.length === 0) {
            addToast({ type: 'warning', title: 'Danh sách trống', message: 'Không có từ nào để thêm vào bộ ôn tập.' });
            return;
        }
        const count = await srsService.addWordsToDeck(filteredVocabList);
        addToast({ type: 'success', title: 'Hoàn tất!', message: `Đã thêm ${count} từ mới vào bộ ôn tập của bạn.` });
        if (count > 0) {
            const { newBadges: xpBadges } = await gamificationService.addXp(count * 2);
            const srsBadges = await gamificationService.checkSrsBadges();
            showBadgeCelebration([...xpBadges, ...srsBadges]);
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

    const renderSubCategorySelector = () => {
        if (mainCategory === 'topik') {
            return (
                 <div className="flex flex-wrap gap-1 p-1 bg-slate-200 dark:bg-slate-700 rounded-lg">
                    {TOPIK_LEVELS.map(l => (
                        <button key={l} onClick={() => handleCategoryChange(l)} className={`px-4 py-1.5 rounded-md font-semibold text-sm transition-colors ${activeSubCategory === l ? 'bg-white dark:bg-slate-800 text-hanguk-blue-600 shadow' : 'text-slate-600 dark:text-slate-300'}`}>
                            Cấp {l}
                        </button>
                    ))}
                </div>
            );
        }
        if (mainCategory === 'specialized') {
            return (
                <select 
                    value={activeSubCategory} 
                    onChange={e => handleCategoryChange(e.target.value)} 
                    className="p-2 rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 font-semibold"
                >
                    {specializedCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
            )
        }
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <FeatureHeader
                title="Học từ vựng"
                description="Học từ vựng thiết yếu cho kỳ thi TOPIK hoặc các lĩnh vực chuyên ngành."
            />
            
            <div className="mb-6 border-b-2 border-slate-200 dark:border-slate-700">
                <button onClick={() => setMainCategory('topik')} className={`px-4 py-2 font-semibold text-sm transition-colors ${mainCategory === 'topik' ? 'border-b-2 border-hanguk-blue-600 text-hanguk-blue-600 dark:text-hanguk-blue-300' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}>
                    TOPIK
                </button>
                <button onClick={() => setMainCategory('specialized')} className={`px-4 py-2 font-semibold text-sm transition-colors ${mainCategory === 'specialized' ? 'border-b-2 border-hanguk-blue-600 text-hanguk-blue-600 dark:text-hanguk-blue-300' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}>
                    Chuyên ngành
                </button>
            </div>

             <div className="mb-6 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    {renderSubCategorySelector()}
                    <button onClick={handleAddAllToSrs} disabled={filteredVocabList.length === 0} className="flex-shrink-0 w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition-colors disabled:bg-slate-400">
                        <PlusIcon /> Thêm ({filteredVocabList.length}) vào SRS
                    </button>
                </div>
                 <div className="relative">
                    <input
                        type="text"
                        placeholder="Tìm từ vựng trong danh sách (Hàn, Việt, Romanization)..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full p-3 pl-10 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                    />
                     <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {apiError && (
                <div className="my-4 p-4 bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-300 rounded-r-lg flex items-start gap-3">
                    <InformationCircleIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="font-bold">Thông báo</p>
                        <p className="text-sm">{apiError}</p>
                    </div>
                </div>
            )}

            {!currentUser?.isVip && mainCategory === 'topik' && <UpgradeToVipPrompt featureName="tạo danh sách từ vựng TOPIK không giới hạn" setActiveFeature={setActiveFeature as any} isSampleData={true} />}

            {isLoading ? <Loader /> : (
                <div className="space-y-3">
                    {filteredVocabList.length > 0 ? filteredVocabList.map(item => (
                        <div key={item.word} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm animate-fade-in">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-xl font-bold">{item.word} <span className="text-base font-normal italic text-slate-500">{item.romanization}</span></h4>
                                    <p className="text-md text-slate-600 dark:text-slate-300">{item.partOfSpeech} - {item.meaning}</p>
                                </div>
                                 <button onClick={() => handleAddSingleToSrs(item)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700" title="Thêm vào SRS">
                                    {addedWords.has(item.word) ? <CheckIcon className="text-green-500" /> : <PlusIcon />}
                                 </button>
                            </div>
                            <div className="mt-2 text-sm text-slate-500 dark:text-slate-400 space-y-1">
                                <div className="group flex items-center gap-2">
                                    <p className="flex-grow">{item.example_sentence}</p>
                                    <button onClick={() => handleCopy(item.example_sentence)} className="p-1 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-200 dark:hover:bg-slate-600"><ClipboardDocumentIcon small/></button>
                                </div>
                                <div className="group flex items-center gap-2">
                                    <p className="flex-grow">"{item.example_translation}"</p>
                                    <button onClick={() => handleCopy(item.example_translation)} className="p-1 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-200 dark:hover:bg-slate-600"><ClipboardDocumentIcon small/></button>
                                </div>
                            </div>
                            <div className="mt-2">
                                {mnemonics[item.word] ? (
                                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-md text-sm text-yellow-800 dark:text-yellow-200">
                                        💡 {mnemonics[item.word]}
                                    </div>
                                ) : (
                                    <button onClick={() => handleGetMnemonic(item)} disabled={loadingMnemonic === item.word} className="text-xs font-semibold text-hanguk-blue-600 hover:underline disabled:opacity-50 flex items-center gap-1">
                                       {loadingMnemonic === item.word ? <Loader /> : <LightbulbIcon small />}
                                       {loadingMnemonic === item.word ? 'Đang tạo...' : 'Tạo mẹo ghi nhớ'}
                                    </button>
                                )}
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                            <p>Không tìm thấy từ vựng nào khớp với tìm kiếm của bạn.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TopikVocab;