import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import * as geminiService from '../services/geminiService';
import * as srsService from '../services/srsService';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import { PlusIcon, CloseIcon, SparklesIcon, SpeakerIcon } from '../components/icons/Icons';
import Loader from '../components/Loader';
import type { GrammarExplanation, VocabItem } from '../types';
import { speak } from '../services/ttsService';

type PopoverMode = 'compact' | 'explanation';

interface PopoverState {
  isVisible: boolean;
  text: string;
  top: number;
  left: number;
  mode: PopoverMode;
}

interface SelectionPopoverContextType {
  showPopover: (text: string, rect: DOMRect) => void;
  hidePopover: () => void;
}

const SelectionPopoverContext = createContext<SelectionPopoverContextType | undefined>(undefined);

export const SelectionPopoverProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  
  const [popoverState, setPopoverState] = useState<PopoverState>({
    isVisible: false,
    text: '',
    top: 0,
    left: 0,
    mode: 'compact',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState<GrammarExplanation | null>(null);

  const showPopover = useCallback((text: string, rect: DOMRect) => {
    if (text.trim().length < 1) return;
    
    setPopoverState({
      isVisible: true,
      text: text,
      top: window.scrollY + rect.top - 10,
      left: window.scrollX + rect.left + rect.width / 2,
      mode: 'compact',
    });
    setExplanation(null);
    setIsLoading(false);
  }, []);

  const hidePopover = useCallback(() => {
    if (!isLoading) {
      setPopoverState(prev => ({ ...prev, isVisible: false }));
    }
  }, [isLoading]);

  const handleAddToSrs = async () => {
    if (!currentUser?.email) {
        addToast({ type: 'error', title: 'Lỗi', message: 'Bạn cần đăng nhập để thêm từ.' });
        hidePopover();
        return;
    }
    setPopoverState(prev => ({...prev, mode: 'compact'}));
    setIsLoading(true);
    try {
      const vocabItem = await geminiService.generateVocabItemForText(popoverState.text);
      if (vocabItem) {
        const count = await srsService.addWordsToDeck([vocabItem]);
        if (count > 0) {
          addToast({ type: 'success', title: 'Đã thêm!', message: `"${vocabItem.word}" đã được thêm vào bộ ôn tập.` });
        } else {
          addToast({ type: 'info', title: 'Đã có', message: `"${vocabItem.word}" đã có trong bộ ôn tập của bạn.` });
        }
      } else {
         addToast({ type: 'error', title: 'Lỗi', message: 'Không thể tạo thẻ học cho từ này.' });
      }
    } catch (error) {
      console.error("Error adding to SRS from popover:", error);
      addToast({ type: 'error', title: 'Lỗi', message: 'Đã xảy ra lỗi khi thêm từ.' });
    } finally {
      setIsLoading(false);
      hidePopover();
    }
  };
  
  const handleExplainGrammar = async () => {
    if (!currentUser?.isVip) {
      addToast({ type: 'warning', title: 'Tính năng VIP', message: 'Giải thích ngữ pháp là tính năng dành cho tài khoản VIP.' });
      hidePopover();
      return;
    }

    setPopoverState(prev => ({ ...prev, mode: 'explanation' }));
    setIsLoading(true);
    setExplanation(null);
    try {
      const result = await geminiService.explainGrammarPoint(popoverState.text);
      if (result) {
        setExplanation(result);
      } else {
        addToast({ type: 'error', title: 'Lỗi', message: 'Không thể giải thích ngữ pháp này.' });
        hidePopover();
      }
    } catch (error) {
      console.error("Error explaining grammar:", error);
      addToast({ type: 'error', title: 'Lỗi', message: 'Đã xảy ra lỗi khi kết nối với Gia sư AI.' });
      hidePopover();
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGrammarToSrs = async (grammarPoint: GrammarExplanation) => {
    if (!currentUser?.email) return;
    const vocabItem: VocabItem = {
        word: grammarPoint.grammar_point,
        romanization: '',
        meaning: grammarPoint.explanation.substring(0, 100) + '...',
        partOfSpeech: 'Ngữ pháp',
        example_sentence: grammarPoint.examples[0]?.korean || '',
        example_translation: grammarPoint.examples[0]?.vietnamese || '',
    };
    const count = await srsService.addWordsToDeck([vocabItem]);
    if (count > 0) {
        addToast({ type: 'success', title: 'Đã thêm!', message: `"${vocabItem.word}" đã được thêm vào bộ ôn tập.` });
    } else {
        addToast({ type: 'info', title: 'Đã có', message: `"${vocabItem.word}" đã có trong bộ ôn tập của bạn.` });
    }
    hidePopover();
  };

  const PopoverComponent = () => {
    if (!popoverState.isVisible) return null;

    if (popoverState.mode === 'explanation') {
      return (
        <div
          className="fixed z-50 w-[400px] bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col animate-fade-in-up"
          style={{
            top: `${popoverState.top}px`,
            left: `${popoverState.left}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="flex justify-between items-center p-2 border-b border-slate-200 dark:border-slate-700">
             <h4 className="font-bold text-sm ml-2">Giải thích Ngữ pháp</h4>
            <button onClick={hidePopover} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600"><CloseIcon small /></button>
          </div>
          <div className="p-3 max-h-80 overflow-y-auto">
            {isLoading ? <div className="flex justify-center p-4"><Loader /></div> : explanation ? (
                <div className="space-y-2 text-sm">
                    <h5 className="font-bold text-lg text-hanguk-blue-700 dark:text-hanguk-blue-300">{explanation.grammar_point}</h5>
                    <p>{explanation.explanation}</p>
                    <h6 className="font-semibold pt-2 border-t border-slate-200 dark:border-slate-700">Ví dụ:</h6>
                    <ul className="space-y-1">
                        {explanation.examples.map((ex, i) => (
                            <li key={i}>
                                <p className="font-semibold">{ex.korean}</p>
                                <p className="text-xs italic">{ex.romanization} - "{ex.vietnamese}"</p>
                            </li>
                        ))}
                    </ul>
                     <div className="flex justify-end pt-2">
                        <button onClick={() => handleAddGrammarToSrs(explanation)} className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white text-xs font-bold rounded-md hover:bg-green-700">
                            <PlusIcon small /> Thêm vào SRS
                        </button>
                    </div>
                </div>
            ) : null}
          </div>
        </div>
      );
    }

    return (
      <div
        className="fixed z-50 flex items-center gap-1 px-2 py-1.5 bg-slate-800 text-white rounded-lg shadow-lg animate-fade-in-up"
        style={{
          top: `${popoverState.top}px`,
          left: `${popoverState.left}px`,
          transform: 'translate(-50%, -100%)',
        }}
      >
        {isLoading ? <Loader /> : (
            <>
                <button onClick={() => speak(popoverState.text, 'ko-KR')} className="p-1.5 rounded hover:bg-slate-700" title="Phát âm"><SpeakerIcon small /></button>
                <button onClick={handleAddToSrs} className="p-1.5 rounded hover:bg-slate-700" title="Thêm vào bộ ôn tập (SRS)"><PlusIcon small /></button>
                <button onClick={handleExplainGrammar} className="p-1.5 rounded hover:bg-slate-700" title="Giải thích Ngữ pháp (AI)"><SparklesIcon small /></button>
                <div className="w-px h-5 bg-slate-600 mx-1"></div>
                <button onClick={hidePopover} className="p-1.5 rounded hover:bg-slate-700" title="Đóng"><CloseIcon small /></button>
            </>
        )}
      </div>
    );
  };
  
  const value = { showPopover, hidePopover };

  return (
    <SelectionPopoverContext.Provider value={value}>
      {children}
      <PopoverComponent />
    </SelectionPopoverContext.Provider>
  );
};

export const useSelectionPopover = (): SelectionPopoverContextType => {
  const context = useContext(SelectionPopoverContext);
  if (context === undefined) {
    throw new Error('useSelectionPopover must be used within a SelectionPopoverProvider');
  }
  return context;
};