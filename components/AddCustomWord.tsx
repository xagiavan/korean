import React, { useState, useCallback } from 'react';
import type { AppFeatureProps, VocabItem } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import * as srsService from '../services/srsService';
import * as gamificationService from '../services/gamificationService';
import FeatureHeader from './FeatureHeader';
import { PlusIcon } from './icons/Icons';

const AddCustomWord: React.FC<AppFeatureProps> = ({ setActiveFeature }) => {
    const { currentUser } = useAuth();
    const { addToast, showBadgeCelebration } = useToast();
    
    const [word, setWord] = useState('');
    const [romanization, setRomanization] = useState('');
    const [meaning, setMeaning] = useState('');
    const [partOfSpeech, setPartOfSpeech] = useState('Danh từ');
    const [exampleSentence, setExampleSentence] = useState('');
    const [exampleTranslation, setExampleTranslation] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const resetForm = useCallback(() => {
        setWord('');
        setRomanization('');
        setMeaning('');
        setPartOfSpeech('Danh từ');
        setExampleSentence('');
        setExampleTranslation('');
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser?.email) {
            addToast({ type: 'error', title: 'Lỗi', message: 'Bạn cần đăng nhập để thực hiện hành động này.' });
            return;
        }

        if (!word.trim() || !meaning.trim()) {
            addToast({ type: 'warning', title: 'Thiếu thông tin', message: 'Vui lòng nhập ít nhất từ tiếng Hàn và nghĩa tiếng Việt.' });
            return;
        }

        setIsSaving(true);
        
        const newVocabItem: VocabItem = {
            word: word.trim(),
            romanization: romanization.trim(),
            meaning: meaning.trim(),
            partOfSpeech: partOfSpeech.trim() || 'Chưa xác định',
            example_sentence: exampleSentence.trim(),
            example_translation: exampleTranslation.trim(),
        };

        // Simulating a short delay for better UX
        await new Promise(resolve => setTimeout(resolve, 300));

        const count = await srsService.addWordsToDeck([newVocabItem]);

        if (count > 0) {
            addToast({ type: 'success', title: 'Thành công!', message: `Đã thêm từ "${newVocabItem.word}" vào bộ ôn tập của bạn.` });
            const { newBadges: xpBadges } = await gamificationService.addXp(10);
            const newSrsBadges = await gamificationService.checkSrsBadges();
            showBadgeCelebration([...xpBadges, ...newSrsBadges]);
            resetForm();
            // Maybe focus the first input again
            const firstInput = document.getElementById('korean-word-input');
            if (firstInput) {
                firstInput.focus();
            }
        } else {
            addToast({ type: 'info', title: 'Từ đã tồn tại', message: `"${newVocabItem.word}" đã có trong bộ ôn tập của bạn.` });
        }
        
        setIsSaving(false);

    }, [currentUser, addToast, word, romanization, meaning, partOfSpeech, exampleSentence, exampleTranslation, resetForm, showBadgeCelebration]);

    const InputField = ({ id, label, value, onChange, placeholder, required = false }: { id: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string, required?: boolean }) => (
        <div>
            <label htmlFor={id} className="block mb-1 font-semibold text-sm text-slate-700 dark:text-slate-300">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                id={id}
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="w-full p-2 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-hanguk-blue-500 focus:border-hanguk-blue-500 transition-all-base"
            />
        </div>
    );
     const TextareaField = ({ id, label, value, onChange, placeholder }: { id: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, placeholder?: string }) => (
        <div>
            <label htmlFor={id} className="block mb-1 font-semibold text-sm text-slate-700 dark:text-slate-300">
                {label}
            </label>
            <textarea
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={2}
                className="w-full p-2 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-hanguk-blue-500 focus:border-hanguk-blue-500 transition-all-base resize-y"
            />
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto">
            <FeatureHeader
                title="Thêm từ vựng tùy chỉnh"
                description="Tự tạo thẻ học cho những từ bạn gặp trong cuộc sống hàng ngày và thêm chúng vào hệ thống ôn tập lặp lại ngắt quãng (SRS)."
            />
            
            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        id="korean-word-input"
                        label="Từ tiếng Hàn"
                        value={word}
                        onChange={(e) => setWord(e.target.value)}
                        placeholder="예: 행복"
                        required
                    />
                     <InputField
                        id="meaning-input"
                        label="Nghĩa tiếng Việt"
                        value={meaning}
                        onChange={(e) => setMeaning(e.target.value)}
                        placeholder="hạnh phúc"
                        required
                    />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        id="romanization-input"
                        label="Romanization"
                        value={romanization}
                        onChange={(e) => setRomanization(e.target.value)}
                        placeholder="haengbok"
                    />
                     <InputField
                        id="pos-input"
                        label="Loại từ"
                        value={partOfSpeech}
                        onChange={(e) => setPartOfSpeech(e.target.value)}
                        placeholder="Danh từ, Động từ..."
                    />
                </div>
                <TextareaField
                    id="example-sentence-input"
                    label="Câu ví dụ (tiếng Hàn)"
                    value={exampleSentence}
                    onChange={(e) => setExampleSentence(e.target.value)}
                    placeholder="저는 지금 정말 행복해요."
                />
                <TextareaField
                    id="example-translation-input"
                    label="Dịch câu ví dụ (tiếng Việt)"
                    value={exampleTranslation}
                    onChange={(e) => setExampleTranslation(e.target.value)}
                    placeholder="Bây giờ tôi thực sự rất hạnh phúc."
                />
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-hanguk-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-hanguk-blue-700 disabled:bg-slate-400"
                    >
                        <PlusIcon /> {isSaving ? 'Đang lưu...' : 'Lưu vào bộ ôn tập'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddCustomWord;