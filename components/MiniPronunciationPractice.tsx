import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { evaluatePronunciation } from '../services/geminiService';
import * as gamificationService from '../services/gamificationService';
import { MicIcon, StopCircleIcon } from './icons/Icons';
import Loader from './Loader';
import { useToast } from '../contexts/ToastContext';

// SpeechRecognition types
interface SpeechRecognitionEvent extends Event {
  results: { [index: number]: { [index: number]: { transcript: string; }; }; };
  resultIndex: number;
}
interface SpeechRecognitionErrorEvent extends Event {
  error: 'no-speech' | 'audio-capture' | 'not-allowed' | 'network';
}
interface SpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
}
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface EvaluationResult {
    score: number;
    feedback: string;
}

interface MiniPronunciationPracticeProps {
    koreanText: string;
}

const MiniPronunciationPractice: React.FC<MiniPronunciationPracticeProps> = ({ koreanText }) => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const [isApiSupported, setIsApiSupported] = useState(true);
    const [isRecording, setIsRecording] = useState(false);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
    const [userTranscript, setUserTranscript] = useState('');
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    const handlePracticeResult = useCallback(async (transcript: string) => {
        if (!koreanText || !currentUser?.email) return;

        setIsEvaluating(true);
        setEvaluationResult(null);
        try {
            const result = await evaluatePronunciation(koreanText, transcript);
            setEvaluationResult(result);
            if (result.score > 0) {
                await gamificationService.addXp(result.score); // 1 XP per point
            }
        } catch (e) {
            console.error("Evaluation error:", e);
            setEvaluationResult({ score: 0, feedback: 'Đã có lỗi xảy ra khi đánh giá phát âm của bạn.' });
        } finally {
            setIsEvaluating(false);
        }
    }, [koreanText, currentUser]);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setIsApiSupported(false);
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.lang = 'ko-KR';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            const transcript = event.results[event.resultIndex][0].transcript;
            setUserTranscript(transcript);
            handlePracticeResult(transcript);
        };

        recognition.onend = () => {
            setIsRecording(false);
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            let feedbackMessage = 'Lỗi nhận dạng giọng nói.';
            if (event.error === 'no-speech') feedbackMessage = 'Không nhận dạng được giọng nói. Vui lòng thử nói to và rõ hơn.';
            else if (event.error === 'not-allowed') feedbackMessage = 'Quyền truy cập micro đã bị từ chối.';
            
            addToast({ type: 'error', title: 'Lỗi ghi âm', message: feedbackMessage });
            setIsRecording(false);
            setIsEvaluating(false);
        };

        recognitionRef.current = recognition;
    }, [handlePracticeResult, addToast]);

    const handleMicClick = useCallback(() => {
        if (!currentUser?.isVip) {
            addToast({ type: 'warning', title: 'Tính năng VIP', message: 'Luyện phát âm là tính năng dành cho tài khoản VIP.' });
            return;
        }

        if (!recognitionRef.current || isEvaluating) return;
        
        if (isRecording) {
            recognitionRef.current.stop();
        } else {
            setEvaluationResult(null);
            setUserTranscript('');
            try {
                recognitionRef.current.start();
                setIsRecording(true);
            } catch (e) {
                console.error("Error starting recognition:", e);
                addToast({ type: 'error', title: 'Lỗi', message: 'Không thể bắt đầu ghi âm.' });
            }
        }
    }, [isEvaluating, isRecording, currentUser, addToast]);

    if (!isApiSupported) {
        return <p className="text-xs text-red-500">Trình duyệt không hỗ trợ nhận dạng giọng nói.</p>;
    }

    return (
        <div className="mt-2 p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg animate-fade-in space-y-3">
            <div className="flex items-center gap-4">
                <button onClick={handleMicClick} disabled={isEvaluating} className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isRecording ? 'bg-red-500 text-white' : 'bg-hanguk-blue-100 dark:bg-hanguk-blue-800 text-hanguk-blue-600 dark:text-hanguk-blue-300'} disabled:opacity-50`}>
                    {isRecording ? <StopCircleIcon /> : <MicIcon />}
                </button>
                <div className="flex-grow">
                    <p className="font-semibold text-sm">Luyện tập:</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 h-5">
                        {isRecording ? <span className="text-red-500 animate-pulse">Đang ghi âm...</span> : isEvaluating ? 'Đang đánh giá...' : (userTranscript ? `Bạn đã nói: "${userTranscript}"` : 'Nhấn micro để nói.')}
                    </p>
                </div>
            </div>
            {isEvaluating && <div className="flex justify-center"><Loader /></div>}
            {evaluationResult && (
                <div className="animate-fade-in-up">
                    <div className="flex items-center gap-2">
                        <span className={`text-2xl font-bold ${evaluationResult.score >= 8 ? 'text-green-500' : evaluationResult.score >= 5 ? 'text-yellow-500' : 'text-red-500'}`}>
                            {evaluationResult.score}/10
                        </span>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{evaluationResult.feedback}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MiniPronunciationPractice;
