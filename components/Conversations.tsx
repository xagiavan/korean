import React, { useState, useCallback, useEffect, useRef } from 'react';
import { getSampleConversation, getConversationSuggestions, sampleConversation } from '../services/geminiService';
import type { ConversationLine } from '../types';
import Loader from './Loader';
import FeatureHeader from './FeatureHeader';
import { SpeakerIcon, LightbulbIcon, PronunciationIcon, ClipboardDocumentIcon } from './icons/Icons';
import { useAuth } from '../contexts/AuthContext';
import UpgradeToVipPrompt from './UpgradeToVipPrompt';
import * as gamificationService from '../services/gamificationService';
import * as statsService from '../services/statsService';
import { useSelectionPopover } from '../contexts/SelectionPopoverContext';
import { speak } from '../services/ttsService';
import MiniPronunciationPractice from './MiniPronunciationPractice';
import { useToast } from '../contexts/ToastContext';

interface ConversationData {
  title: string;
  conversation: ConversationLine[];
}

interface ConversationSuggestion {
  topic: string;
  description: string;
}

type Feature = 'dictionary' | 'translator' | 'vocab' | 'srs' | 'conversations' | 'pronunciation' | 'handwriting' | 'quiz' | 'settings' | 'upgrade' | 'auth';

interface ConversationsProps {
  setActiveFeature: (feature: Feature, payload?: any) => void;
}

const Conversations: React.FC<ConversationsProps> = ({ setActiveFeature }) => {
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const [topicInput, setTopicInput] = useState('');
  const [conversationData, setConversationData] = useState<ConversationData | null>(null);
  const [suggestions, setSuggestions] = useState<ConversationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [showVipPrompt, setShowVipPrompt] = useState(false);
  const { showPopover } = useSelectionPopover();
  const contentRef = useRef<HTMLDivElement>(null);
  const [practiceIndex, setPracticeIndex] = useState<number | null>(null);

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


  const fetchConversation = useCallback(async (selectedTopic: string) => {
    if (!selectedTopic.trim()) return;

    setIsLoading(true);
    setConversationData(null);
    setSuggestions([]);
    setPracticeIndex(null);
    
    const isVip = currentUser?.isVip ?? false;
    setShowVipPrompt(!isVip);

    let data;
    if (isVip && currentUser?.email) {
        data = await getSampleConversation(selectedTopic);
        await gamificationService.addXp(25);
        await gamificationService.recordConversationCreation();
    } else {
        data = { ...sampleConversation, title: `${selectedTopic} (Mẫu)` };
    }
    
    setConversationData(data);
    setIsLoading(false);

    // Fetch suggestions after conversation is loaded
    if (isVip) {
        setIsSuggestionsLoading(true);
        const suggestionData = await getConversationSuggestions(selectedTopic);
        setSuggestions(suggestionData);
        setIsSuggestionsLoading(false);
    }
  }, [currentUser, setIsLoading, setConversationData, setSuggestions, setShowVipPrompt, setIsSuggestionsLoading]);
  
  const handleSubmit = useCallback((e: React.FormEvent) => {
      e.preventDefault();
      fetchConversation(topicInput);
  }, [fetchConversation, topicInput]);
  
  const handleSpeak = async (text: string) => {
    if (!currentUser?.email) return;
    speak(text);
    await statsService.incrementListenStat();
  }
  
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
        title="Sáng tạo Hội thoại"
        description="Nhập một chủ đề bất kỳ, AI sẽ tạo ra một đoạn hội thoại thực tế để bạn luyện tập."
      />
      
      <form onSubmit={handleSubmit} className="mb-6 flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={topicInput}
          onChange={(e) => setTopicInput(e.target.value)}
          placeholder="Ví dụ: Đặt vé xem phim, tại sân bay..."
          className="flex-grow p-3 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-hanguk-blue-500 focus:border-hanguk-blue-500 transition-all-base"
        />
        <button type="submit" disabled={isLoading || !topicInput.trim()} className="px-6 py-3 bg-hanguk-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-hanguk-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all-base">
            {isLoading ? 'Đang tạo...' : 'Tạo'}
        </button>
      </form>

      {showVipPrompt && <UpgradeToVipPrompt featureName="tạo hội thoại không giới hạn" setActiveFeature={setActiveFeature} isSampleData={!currentUser?.isVip} />}

      <div className="min-h-[20rem] flex flex-col items-center justify-center">
        {isLoading ? <Loader /> : conversationData ? (
          <div className="w-full animate-fade-in-up" ref={contentRef}>
            <div className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-lg shadow-md">
              <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 text-hanguk-blue-800 dark:text-hanguk-blue-300">{conversationData.title}</h3>
              <div className="space-y-4">
                {(conversationData.conversation || []).map((line, index) => (
                  <div key={index} className={`flex flex-col ${line.speaker === 'A' ? 'items-start' : 'items-end'}`}>
                    <div className={`max-w-md p-3 rounded-xl shadow-sm ${line.speaker === 'A' ? 'bg-slate-100 dark:bg-slate-700' : 'bg-hanguk-blue-100 dark:bg-hanguk-blue-900'}`}>
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-grow space-y-1">
                            <div className="group flex items-center gap-2">
                                <p data-selectable="true" className="font-bold text-base sm:text-lg text-slate-800 dark:text-slate-100">{line.korean}</p>
                                <button onClick={() => handleCopy(line.korean)} className="p-1 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-200 dark:hover:bg-slate-600"><ClipboardDocumentIcon small/></button>
                            </div>
                            <div className="group flex items-center gap-2">
                                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 italic break-all">{line.romanization}</p>
                                <button onClick={() => handleCopy(line.romanization)} className="p-1 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-200 dark:hover:bg-slate-600"><ClipboardDocumentIcon small/></button>
                            </div>
                            <div className="group flex items-center gap-2">
                                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1">"{line.vietnamese}"</p>
                                <button onClick={() => handleCopy(line.vietnamese)} className="p-1 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-200 dark:hover:bg-slate-600"><ClipboardDocumentIcon small/></button>
                            </div>
                        </div>
                        <div className="flex items-center flex-shrink-0">
                          <button onClick={() => handleSpeak(line.korean)} className="text-slate-500 hover:text-hanguk-blue-600 dark:text-slate-400 dark:hover:text-hanguk-blue-400 transition-all-base p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600"><SpeakerIcon small /></button>
                          <button onClick={() => setPracticeIndex(practiceIndex === index ? null : index)} className={`text-slate-500 hover:text-hanguk-blue-600 dark:text-slate-400 dark:hover:text-hanguk-blue-400 transition-all-base p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 ${practiceIndex === index ? 'bg-hanguk-blue-200 dark:bg-hanguk-blue-700' : ''}`}><PronunciationIcon small /></button>
                        </div>
                      </div>
                      {practiceIndex === index && (
                          <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-600">
                              <MiniPronunciationPractice koreanText={line.korean} />
                          </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {isSuggestionsLoading ? <div className="mt-4"><Loader /></div> : suggestions.length > 0 && (
                 <div className="mt-6">
                    <h4 className="font-bold text-lg text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2"><LightbulbIcon /> Gợi ý khám phá</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {suggestions.map(sugg => (
                            <button key={sugg.topic} onClick={() => { setTopicInput(sugg.topic); fetchConversation(sugg.topic); }} className="p-4 bg-white dark:bg-slate-800 rounded-lg text-left hover:shadow-lg hover:scale-105 transition-all-base shadow-md border border-slate-200 dark:border-slate-700">
                                <p className="font-semibold text-hanguk-blue-800 dark:text-hanguk-blue-300">{sugg.topic}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{sugg.description}</p>
                            </button>
                        ))}
                    </div>
                 </div>
            )}
          </div>
        ) : (
          <div className="text-center text-slate-500 dark:text-slate-400">
            <p>Nhập một chủ đề bạn muốn học và nhấn "Tạo".</p>
            <p className="text-sm mt-1">Ví dụ: "Đi khám bệnh", "Phỏng vấn xin việc", "Nói về sở thích"...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Conversations;