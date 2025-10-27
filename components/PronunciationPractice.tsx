import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MicIcon, PlayCircleIcon, RefreshIcon, StopCircleIcon } from './icons/Icons';
import FeatureHeader from './FeatureHeader';
import { evaluatePronunciation, evaluateShadowing } from '../services/geminiService';
import { pronunciationContexts } from '../services/pronunciationPhrases';
import { hangeulData } from '../services/hangeulData';
import * as srsService from '../services/srsService';
import Loader from './Loader';
import * as gamificationService from '../services/gamificationService';
import * as statsService from '../services/statsService';
import { speak } from '../services/ttsService';
import type { ShadowingReport, AppFeatureProps, VocabItem, Badge } from '../types';
import CircularProgress from './CircularProgress';
import { useAuth } from '../contexts/AuthContext';


// Fix for Web Speech API types not being in standard TS lib.
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

type PracticeType = 'phrases' | 'hangeul' | 'srs';

const PronunciationPractice: React.FC<AppFeatureProps> = ({ setActiveFeature }) => {
  const { currentUser } = useAuth();
  const [practiceType, setPracticeType] = useState<PracticeType>('phrases');
  const [mode, setMode] = useState<'practice' | 'shadowing'>('practice');
  
  // Phrase state
  const [contextKeys, setContextKeys] = useState<string[]>([]);
  const [selectedContextKey, setSelectedContextKey] = useState<string>('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  // Hangeul state
  const [hangeulGroupIndex, setHangeulGroupIndex] = useState(0);
  const [hangeulCharIndex, setHangeulCharIndex] = useState(0);

  // SRS state
  const [srsDeck, setSrsDeck] = useState<VocabItem[]>([]);
  const [srsWordIndex, setSrsWordIndex] = useState(0);

  const [isApiSupported, setIsApiSupported] = useState(true);
  const [permissionError, setPermissionError] = useState(false);
  const [userTranscript, setUserTranscript] = useState('');
  
  // Practice Mode State
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);

  // Shadowing Mode State
  const [shadowingState, setShadowingState] = useState<'idle' | 'playing' | 'recording' | 'evaluating' | 'feedback'>('idle');
  const [shadowingReport, setShadowingReport] = useState<ShadowingReport | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  // Load phrase contexts on mount
  useEffect(() => {
    const keys = Object.keys(pronunciationContexts);
    setContextKeys(keys);
    if (keys.length > 0) {
        setSelectedContextKey(keys[0]);
    }
  }, []);
  
  // Load SRS deck when user switches to that mode
  useEffect(() => {
    const loadDeck = async () => {
        if (practiceType === 'srs' && currentUser?.email) {
            const deck = await srsService.getDeck();
            setSrsDeck(deck);
            setSrsWordIndex(0);
        }
    };
    loadDeck();
  }, [practiceType, currentUser]);

  const currentItemToPractice = useMemo(() => {
    if (practiceType === 'phrases') {
        const phrases = pronunciationContexts[selectedContextKey]?.phrases || [];
        return phrases[currentPhraseIndex] || null;
    } else if (practiceType === 'hangeul') {
        const char = hangeulData[hangeulGroupIndex]?.chars[hangeulCharIndex];
        if (char) {
            return { korean: char.char, romanization: char.romanization };
        }
        return null;
    } else { // srs
        const word = srsDeck[srsWordIndex];
        if (word) {
            return { korean: word.word, romanization: word.romanization };
        }
        return null;
    }
  }, [practiceType, selectedContextKey, currentPhraseIndex, hangeulGroupIndex, hangeulCharIndex, srsDeck, srsWordIndex]);
  
  const resetForNewItem = useCallback(() => {
    setUserTranscript('');
    setEvaluationResult(null);
    setIsRecording(false);
    setIsEvaluating(false);
    setShadowingState('idle');
    setShadowingReport(null);
  }, []);
  
  const handlePracticeTypeChange = (type: PracticeType) => {
    setPracticeType(type);
    setCurrentPhraseIndex(0);
    setHangeulCharIndex(0);
    setSrsWordIndex(0);
    resetForNewItem();
  };


  useEffect(() => {
    setCurrentPhraseIndex(0);
    setHangeulCharIndex(0);
    resetForNewItem();
  }, [selectedContextKey, hangeulGroupIndex, resetForNewItem]);

  useEffect(() => {
    resetForNewItem();
  }, [mode, resetForNewItem]);

  const nextItem = useCallback(() => {
    if (practiceType === 'phrases') {
        const phrases = pronunciationContexts[selectedContextKey]?.phrases || [];
        if (phrases.length > 0) setCurrentPhraseIndex(prev => (prev + 1) % phrases.length);
    } else if (practiceType === 'hangeul') {
        const chars = hangeulData[hangeulGroupIndex]?.chars || [];
        if (chars.length > 0) setHangeulCharIndex(prev => (prev + 1) % chars.length);
    } else { // srs
        if (srsDeck.length > 0) setSrsWordIndex(prev => (prev + 1) % srsDeck.length);
    }
    resetForNewItem();
  }, [practiceType, selectedContextKey, hangeulGroupIndex, srsDeck.length, resetForNewItem]);

  const handlePracticeModeResult = useCallback(async (transcript: string) => {
      if (!currentItemToPractice || !currentUser?.email) return;
      setIsEvaluating(true);
      setEvaluationResult(null);
      const result = await evaluatePronunciation(currentItemToPractice.korean, transcript);
      setEvaluationResult(result);
      if (result.score > 0) {
        await gamificationService.addXp(result.score * 2);
      }
      setIsEvaluating(false);
  }, [currentItemToPractice, currentUser]);

  const handleShadowingModeResult = useCallback(async (transcript: string) => {
    if (!currentItemToPractice || !currentUser?.email) return;
    setShadowingState('evaluating');
    const report = await evaluateShadowing(currentItemToPractice.korean, transcript);
    setShadowingReport(report);
    if (report.overallScore > 0) {
      await gamificationService.addXp(Math.round(report.overallScore / 5)); // up to 20 xp
    }
    setShadowingState('feedback');
  }, [currentItemToPractice, currentUser]);


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
      if(mode === 'practice') {
        handlePracticeModeResult(transcript);
      } else {
        handleShadowingModeResult(transcript);
      }
    };

    recognition.onend = () => {
      if(mode === 'practice') setIsRecording(false);
      if(mode === 'shadowing' && shadowingState === 'recording') {
         if (!userTranscript) {
            handleShadowingModeResult(""); 
         }
      }
    };
    
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        let feedbackMessage = 'Đã xảy ra lỗi khi nhận dạng giọng nói. Vui lòng thử lại.';
        switch (event.error) {
            case 'no-speech': feedbackMessage = 'Không nhận dạng được giọng nói. Vui lòng thử nói to và rõ hơn.'; break;
            case 'audio-capture': feedbackMessage = 'Không thể thu âm. Vui lòng kiểm tra lại micro của bạn.'; break;
            case 'not-allowed': feedbackMessage = 'Quyền truy cập micro đã bị từ chối. Vui lòng cấp quyền trong cài đặt trình duyệt và tải lại trang.'; setPermissionError(true); break;
            case 'network': feedbackMessage = 'Lỗi mạng. Vui lòng kiểm tra kết nối internet của bạn.'; break;
        }
        if (mode === 'practice') {
            setEvaluationResult({ score: 0, feedback: feedbackMessage });
            setIsRecording(false);
        } else {
            setShadowingState('idle'); 
        }
    };

    recognitionRef.current = recognition;
  }, [mode, handlePracticeModeResult, handleShadowingModeResult, shadowingState, userTranscript]);
  
  const handleMicClick = useCallback(() => {
    if (!recognitionRef.current || isEvaluating || permissionError) return;
    
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      resetForNewItem();
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.error("Error starting recognition:", e);
        setEvaluationResult({ score: 0, feedback: 'Không thể bắt đầu ghi âm. Micro có thể đang được sử dụng bởi một ứng dụng khác.'});
      }
    }
  }, [isEvaluating, isRecording, permissionError, resetForNewItem]);

  const handleStartShadowing = useCallback(async () => {
    if (!currentItemToPractice || permissionError || !currentUser?.email) return;
    resetForNewItem();
    setShadowingState('playing');
    speak(currentItemToPractice.korean, 'ko-KR', () => {
        setShadowingState('recording');
        recognitionRef.current?.start();
    });
    await statsService.incrementListenStat();
  }, [currentItemToPractice, permissionError, resetForNewItem, currentUser]);
  
  const renderPracticeModeControls = () => (
    <>
        <button
            onClick={handleMicClick}
            disabled={isEvaluating || permissionError || !currentItemToPractice}
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all-base ${isRecording ? 'bg-red-500 animate-pulse shadow-lg' : 'bg-hanguk-blue-600 hover:bg-hanguk-blue-700'} disabled:bg-slate-400 disabled:cursor-not-allowed`}
        >
            <MicIcon className="w-8 h-8 text-white"/>
        </button>
        <p className="mt-4 text-slate-500 dark:text-slate-400 h-6 font-semibold">
            {isRecording ? 'Đang ghi âm...' : isEvaluating ? 'Đang đánh giá...' : (userTranscript ? `Bạn đã nói: "${userTranscript}"` : 'Nhấn để bắt đầu ghi âm')}
        </p>
    </>
  );

  const renderPracticeFeedback = () => evaluationResult && (
    <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg animate-fade-in-up">
        <h4 className="font-bold text-lg">Đánh giá của AI</h4>
        <div className="flex items-center justify-center gap-4 my-2">
            <span className={`text-5xl font-bold ${evaluationResult.score >= 8 ? 'text-green-500' : evaluationResult.score >= 5 ? 'text-yellow-500' : 'text-red-500'}`}>
                {evaluationResult.score}
            </span>
            <span className="text-xl text-slate-500">/ 10</span>
        </div>
        <p className="text-slate-600 dark:text-slate-300">{evaluationResult.feedback}</p>
    </div>
  );

  const renderShadowingModeControls = () => (
    <div className="flex flex-col items-center">
        {shadowingState === 'idle' || shadowingState === 'feedback' ? (
             <button onClick={handleStartShadowing} disabled={permissionError || !currentItemToPractice} className="px-6 py-3 bg-hanguk-blue-600 text-white font-bold rounded-lg shadow-md hover: