
import React, { useState, useEffect, useCallback } from 'react';
import { translateText } from '../services/geminiService';
import * as translationHistoryService from '../services/translationHistoryService';
import type { TranslationHistoryItem, AppFeatureProps } from '../types';
import Loader from './Loader';
import FeatureHeader from './FeatureHeader';
import { TranslateIcon, SpeakerIcon, ArrowsRightLeftIcon, ClipboardDocumentIcon, XCircleIcon, ListBulletIcon } from './icons/Icons';
import { useAuth } from '../contexts/AuthContext';
import UpgradeToVipPrompt from './UpgradeToVipPrompt';
import * as gamificationService from '../services/gamificationService';
import * as statsService from '../services/statsService';
import { speak } from '../services/ttsService';
import { useToast } from '../contexts/ToastContext';

const LANGUAGES = {
  'Korean': 'Hàn',
  'Vietnamese': 'Việt',
  'English': 'Anh',
};

export type LangKey = keyof typeof LANGUAGES;

const Translator: React.FC<AppFeatureProps> = ({ setActiveFeature }) => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const [inputText, setInputText] = useState('');
    const [translation, setTranslation] = useState('');
    const [romanization, setRomanization] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [fromLang, setFromLang] = useState<LangKey>('Vietnamese');
    const [toLang, setToLang] = useState<LangKey>('Korean');
    const [history, setHistory] = useState<TranslationHistoryItem[]>([]);
    const [isHistoryLoading, setIsHistoryLoading] = useState(true);

    const updateHistory = useCallback(async () => {
        if (currentUser?.email) {
            setIsHistoryLoading(true);
            const historyData = await translationHistoryService.getHistory();
            setHistory(historyData);
            setIsHistoryLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        updateHistory();
    }, [updateHistory]);

    const handleSwapLanguages = useCallback(() => {
        if (isLoading) return;
        setFromLang(toLang);
        setToLang(fromLang);
        setInputText(translation);
        setTranslation(inputText);
        setRomanization('');
    }, [fromLang, toLang, inputText, translation, isLoading]);

    const handleTranslate = useCallback(async () => {
        if (!inputText.trim() || !currentUser?.email) return;

        if (!currentUser?.isVip) {
            addToast({
                type: 'warning',
                title: 'Tính năng VIP',
                message: 'Dịch thuật không giới hạn là tính năng VIP. Vui lòng nâng cấp.'
            });
            return;
        }

        setIsLoading(true);
        setTranslation('');
        setRomanization('');

        try {
            const result = await translateText(inputText, fromLang, toLang);
            setTranslation(result.translation);
            setRomanization(result.romanization);
            await translationHistoryService.addHistoryItem({
                inputText,
                fromLang,
                toLang,
                translation: result.translation
            });
            await gamificationService.addXp(10);
            await updateHistory();
        } catch (error) {
            console.error("Translation error:", error);
            setTranslation("Đã xảy ra lỗi khi dịch.");
        } finally {
            setIsLoading(false);
        }
    }, [inputText, currentUser, fromLang, toLang, addToast, updateHistory]);
    
    const handleSpeak = useCallback(async (text: string, lang: LangKey) => {
        if (!currentUser?.email) return;
        const langCode = { 'Korean': 'ko-KR', 'Vietnamese': 'vi-VN', 'English': 'en-US' }[lang];
        speak(text, langCode);
        await statsService.incrementListenStat();
    }, [currentUser]);
    
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

    const handleDeleteItem = useCallback(async (id: string) => {
        if (!currentUser?.email) return;
        await translationHistoryService.deleteHistoryItem(id);
        await updateHistory();
        addToast({ type: 'info', title: 'Đã xóa', message: 'Mục lịch sử đã được xóa.' });
    }, [currentUser, updateHistory, addToast]);

    const handleClearHistory = useCallback(async () => {
        if (!currentUser?.email) return;
        if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử dịch không?')) {
            await translationHistoryService.deleteUserHistory();
            await updateHistory();
            addToast({ type: 'success', title: 'Hoàn tất', message: 'Toàn bộ lịch sử dịch đã được xóa.' });
        }
    }, [currentUser, updateHistory, addToast]);


    return (
        <div className="max-w-4xl mx-auto">
            <FeatureHeader
                title="Dịch thuật thông minh"
                description="Dịch giữa tiếng Hàn, Việt, và Anh, có kèm phiên âm Romanization."
            />
            {!currentUser?.isVip && <UpgradeToVipPrompt featureName="dịch thuật không giới hạn" setActiveFeature={setActiveFeature} />}
            
            <div className="flex flex-col md:flex-row gap-4 items-center">
                {/* Input Panel */}
                <div className="w-full md:flex-1 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md">
                    <select value={fromLang} onChange={e => setFromLang(e.target.value as LangKey)} className="p-2 rounded-md border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 mb-2 w-full">
                        {Object.entries(LANGUAGES).map(([key, value]) => <option key={key} value={key}>{`Từ: ${value}`}</option>)}
                    </select>
                    <div className="relative">
                        <textarea
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            placeholder={`Nhập văn bản tiếng ${LANGUAGES[fromLang]}...`}
                            className="w-full h-32 sm:h-40 p-2 border-2 border-slate-200 dark:border-slate-700 rounded-md resize-none"
                        />
                        {inputText && !isLoading && (
                            <div className="absolute top-2 right-2 flex items-center gap-1">
                                <button type="button" onClick={() => handleCopy(inputText)} className="text-slate-500 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600" aria-label="Sao chép">
                                    <ClipboardDocumentIcon small/>
                                </button>
                                <button type="button" onClick={() => handleSpeak(inputText, fromLang)} className="text-slate-500 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600" aria-label="Nghe">
                                    <SpeakerIcon small/>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Swap Button */}
                <div className="flex-shrink-0 my-2 md:my-0">
                    <button 
                        type="button"
                        onClick={handleSwapLanguages} 
                        className="p-3 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-hanguk-blue-100 dark:hover:bg-hanguk-blue-800 hover:text-hanguk-blue-700 dark:hover:text-hanguk-blue-300 transition-all-base transform rotate-90 md:rotate-0 hover:scale-110"
                        aria-label="Đảo ngược ngôn ngữ"
                    >
                        <ArrowsRightLeftIcon />
                    </button>
                </div>

                {/* Output Panel */}
                <div className="w-full md:flex-1 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md">
                     <select value={toLang} onChange={e => setToLang(e.target.value as LangKey)} className="p-2 rounded-md border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 mb-2 w-full">
                        {Object.entries(LANGUAGES).map(([key, value]) => <option key={key} value={key}>{`Sang: ${value}`}</option>)}
                    </select>
                    <div className="relative w-full h-32 sm:h-40 p-2 border-2 border-slate-200 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-900 overflow-y-auto">
                        {isLoading ? <div className="flex justify-center items-center h-full"><Loader /></div> :
                            (
                                <>
                                    <p className="font-semibold text-lg">{translation}</p>
                                    {romanization && toLang === 'Korean' && <p className="text-slate-500 italic">{romanization}</p>}
                                </>
                            )
                        }
                         {translation && !isLoading && (
                            <div className="absolute top-2 right-2 flex items-center gap-1">
                                <button type="button" onClick={() => handleCopy(translation)} className="text-slate-500 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600" aria-label="Sao chép">
                                    <ClipboardDocumentIcon small />
                                </button>
                                <button type="button" onClick={() => handleSpeak(translation, toLang)} className="text-slate-500 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600" aria-label="Nghe">
                                    <SpeakerIcon small/>
                                </button>
                            </div>
                         )}
                    </div>
                </div>
            </div>

            <div className="text-center my-6">
                <button onClick={handleTranslate} disabled={isLoading || !inputText.trim()} className="px-8 py-3 bg-hanguk-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-hanguk-blue-700 disabled:bg-slate-400">
                    <TranslateIcon className="inline w-5 h-5 mr-2"/> {isLoading ? 'Đang dịch...' : 'Dịch'}
                </button>
            </div>

            <div className="mt-8">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg">Lịch sử dịch</h3>
                    {history.length > 0 && (
                        <button
                            onClick={handleClearHistory}
                            className="text-sm font-semibold text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                        >
                            Xóa tất cả
                        </button>
                    )}
                </div>
                {isHistoryLoading ? <Loader /> : history.length > 0 ? (
                    <div className="space-y-2">
                        {history.map(item => (
                            <div key={item.id} className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm text-sm flex justify-between items-center gap-2 animate-fade-in">
                                <div className="flex-grow cursor-pointer" onClick={() => { setInputText(item.inputText); setFromLang(item.fromLang as LangKey); setToLang(item.toLang as LangKey); setTranslation(item.translation); setRomanization(''); }}>
                                    <p className="text-slate-500 dark:text-slate-400">{item.inputText}</p>
                                    <p className="font-semibold text-hanguk-blue-700 dark:text-hanguk-blue-300">{item.translation}</p>
                                </div>
                                 <button
                                    onClick={() => handleDeleteItem(item.id)}
                                    className="p-1 text-slate-400 hover:text-red-500 rounded-full flex-shrink-0"
                                    aria-label="Xóa mục này"
                                >
                                    <XCircleIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg flex flex-col items-center">
                        <div className="p-4 bg-slate-200 dark:bg-slate-700 rounded-full mb-4">
                            <TranslateIcon className="w-8 h-8 text-slate-500 dark:text-slate-400" />
                        </div>
                        <p className="font-semibold text-slate-600 dark:text-slate-300">Lịch sử dịch của bạn trống.</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                            Bắt đầu dịch một văn bản và nó sẽ xuất hiện ở đây để bạn xem lại.
                        </p>
                        <button onClick={() => setActiveFeature('phrases')} className="mt-6 flex items-center gap-2 px-4 py-2 bg-hanguk-blue-100 dark:bg-hanguk-blue-900 text-hanguk-blue-700 dark:text-hanguk-blue-300 font-semibold rounded-lg text-sm hover:bg-hanguk-blue-200 dark:hover:bg-hanguk-blue-800 transition-colors">
                            <ListBulletIcon small />
                            Học các cụm từ thông dụng
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Translator;
