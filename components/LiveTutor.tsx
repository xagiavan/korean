import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob as GeminiBlob } from "@google/genai";
import FeatureHeader from './FeatureHeader';
import { MicIcon, StopCircleIcon, UserIcon } from './icons/Icons';
import { useAuth } from '../contexts/AuthContext';
import UpgradeToVipPrompt from './UpgradeToVipPrompt';
import type { ChatMessage, AppFeatureProps } from '../types';
import Loader from './Loader';
import * as featureFlagService from '../services/featureFlagService';

// --- Helper functions from Gemini API guidelines ---

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): GeminiBlob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

// --- Component ---

type LiveTutorState = 'idle' | 'connecting' | 'active' | 'error' | 'unsupported';

const LiveTutor: React.FC<AppFeatureProps> = ({ setActiveFeature }) => {
    const { currentUser } = useAuth();
    const [tutorState, setTutorState] = useState<LiveTutorState>('idle');
    const [transcriptionHistory, setTranscriptionHistory] = useState<ChatMessage[]>([]);
    const [limitMessage, setLimitMessage] = useState<string | null>(null);
    
    const ai = useRef<GoogleGenAI | null>(null);
    const sessionPromise = useRef<Promise<any> | null>(null);
    const audioStream = useRef<MediaStream | null>(null);
    const inputAudioContext = useRef<AudioContext | null>(null);
    const outputAudioContext = useRef<AudioContext | null>(null);
    const scriptProcessor = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSource = useRef<MediaStreamAudioSourceNode | null>(null);
    const sessionTimerRef = useRef<number | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [transcriptionHistory]);

    const nextStartTime = useRef(0);
    const sources = useRef(new Set<AudioBufferSourceNode>());

    const initAi = useCallback(() => {
        // Assume API_KEY is set in the environment
        ai.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }, []);
    
    const stopConversation = useCallback(async () => {
        if (sessionTimerRef.current) {
            clearTimeout(sessionTimerRef.current);
            sessionTimerRef.current = null;
        }

        if (sessionPromise.current) {
            try {
                const session = await sessionPromise.current;
                session.close();
            } catch (e) {
                console.error("Error closing session:", e);
            }
        }
        
        scriptProcessor.current?.disconnect();
        mediaStreamSource.current?.disconnect();
        inputAudioContext.current?.close().catch(e => console.error("Error closing input audio context:", e));
        outputAudioContext.current?.close().catch(e => console.error("Error closing output audio context:", e));
        audioStream.current?.getTracks().forEach(track => track.stop());

        for (const source of sources.current.values()) {
            source.stop();
        }
        sources.current.clear();
        nextStartTime.current = 0;
        
        sessionPromise.current = null;
        setTutorState('idle');
    }, []);

    useEffect(() => {
        if (!window.AudioContext && !(window as any).webkitAudioContext) {
            setTutorState('unsupported');
        } else {
            initAi();
        }
        
        return () => {
            stopConversation();
        };
    }, [initAi, stopConversation]);

    const startConversation = async () => {
        if (!ai.current) {
            setTutorState('error');
            return;
        };
        setTutorState('connecting');
        setTranscriptionHistory([]);
        setLimitMessage(null);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioStream.current = stream;

            inputAudioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            const outputNode = outputAudioContext.current.createGain();
            outputNode.connect(outputAudioContext.current.destination);
            
            let currentInputTranscription = '';
            let currentOutputTranscription = '';

            sessionPromise.current = ai.current.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        const source = inputAudioContext.current!.createMediaStreamSource(stream);
                        mediaStreamSource.current = source;
                        const sp = inputAudioContext.current!.createScriptProcessor(4096, 1, 1);
                        scriptProcessor.current = sp;
                        
                        sp.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob = createBlob(inputData);
                            sessionPromise.current?.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        source.connect(sp);
                        sp.connect(inputAudioContext.current!.destination);
                        setTutorState('active');
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.outputTranscription) {
                            currentOutputTranscription += message.serverContent.outputTranscription.text;
                        } else if (message.serverContent?.inputTranscription) {
                            currentInputTranscription += message.serverContent.inputTranscription.text;
                        }

                        if (message.serverContent?.turnComplete) {
                            if (currentInputTranscription.trim() || currentOutputTranscription.trim()) {
                                const input: ChatMessage = { role: 'user', parts: [{ text: currentInputTranscription }] };
                                const output: ChatMessage = { role: 'model', parts: [{ text: currentOutputTranscription }] };
                                setTranscriptionHistory(prev => [...prev, input, output]);
                            }
                            currentInputTranscription = '';
                            currentOutputTranscription = '';
                        }
                        
                        const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
                        if (base64EncodedAudioString && outputAudioContext.current) {
                            nextStartTime.current = Math.max(
                                nextStartTime.current,
                                outputAudioContext.current.currentTime,
                            );
                            const audioBuffer = await decodeAudioData(
                                decode(base64EncodedAudioString),
                                outputAudioContext.current,
                                24000,
                                1,
                            );
                            const source = outputAudioContext.current.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputNode);
                            source.addEventListener('ended', () => {
                                sources.current.delete(source);
                            });

                            source.start(nextStartTime.current);
                            nextStartTime.current = nextStartTime.current + audioBuffer.duration;
                            sources.current.add(source);
                        }

                        if (message.serverContent?.interrupted) {
                            for (const source of sources.current.values()) {
                                source.stop();
                                sources.current.delete(source);
                            }
                            nextStartTime.current = 0;
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Live session error:', e);
                        setTutorState('error');
                    },
                    onclose: (e: CloseEvent) => {
                        console.log('Live session closed.');
                        stopConversation();
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    outputAudioTranscription: {},
                    inputAudioTranscription: {},
                    systemInstruction: 'You are a friendly and encouraging Korean language tutor named Hanbi. Your student is a Vietnamese speaker. Keep your responses concise and suitable for a beginner to intermediate level. If the user stops talking for a while, ask them a simple question to re-engage them, like "What do you want to talk about?" or "Ask me anything in Korean!".',
                },
            });
            
            const timeLimit = !currentUser?.isVip && featureFlagService.isFeatureEnabled('liveTutorTimeLimit') ? 5 * 60 * 1000 : null;
            if (timeLimit) {
                sessionTimerRef.current = window.setTimeout(() => {
                    setLimitMessage('Bạn đã hết thời gian dùng thử cho Gia sư AI Live. Nâng cấp VIP để trò chuyện không giới hạn!');
                    stopConversation();
                }, timeLimit);
            }

        } catch (error) {
            console.error("Failed to start conversation:", error);
            setTutorState('error');
        }
    };
    
    return (
        <div className="max-w-2xl mx-auto h-full flex flex-col">
            <FeatureHeader
                title="Gia sư AI Live"
                description="Trò chuyện trực tiếp với gia sư AI để luyện nghe nói và nhận phản hồi tức thì."
            />

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md flex-grow flex flex-col items-center justify-center">
                {tutorState === 'unsupported' && <p className="text-red-500">Trình duyệt không được hỗ trợ.</p>}
                {tutorState === 'error' && <p className="text-red-500">Đã xảy ra lỗi kết nối. Vui lòng kiểm tra quyền truy cập micro và thử lại.</p>}

                {tutorState === 'idle' && (
                    <div className="text-center">
                        <button onClick={startConversation} disabled={!currentUser || !ai.current} className="w-24 h-24 bg-hanguk-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-hanguk-blue-700 transition-all-base disabled:bg-slate-400">
                            <MicIcon className="w-10 h-10" />
                        </button>
                        <p className="mt-4 font-semibold text-slate-600 dark:text-slate-300">Nhấn để bắt đầu trò chuyện</p>
                        {!currentUser?.isVip && (
                            <p className="text-sm text-slate-500 mt-1">(5 phút dùng thử cho tài khoản miễn phí)</p>
                        )}
                        {limitMessage && <p className="mt-4 text-yellow-600 dark:text-yellow-400 font-semibold">{limitMessage}</p>}
                    </div>
                )}
                
                {tutorState === 'connecting' && (
                    <div className="flex flex-col items-center">
                        <Loader />
                        <p className="mt-4 font-semibold text-slate-500">Đang kết nối với Gia sư AI...</p>
                    </div>
                )}
                
                {tutorState === 'active' && (
                    <div className="w-full h-full flex flex-col">
                        <div className="flex-grow p-4 -mx-4 overflow-y-auto space-y-4 mb-4">
                            {transcriptionHistory.map((msg, index) => (msg.parts[0].text.trim()) && (
                                <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                    {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-hanguk-blue-100 dark:bg-hanguk-blue-900 flex items-center justify-center font-bold text-sm flex-shrink-0">AI</div>}
                                    <div className={`max-w-xs sm:max-w-md p-3 rounded-lg shadow-sm ${msg.role === 'user' ? 'bg-hanguk-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700'}`}>
                                        {msg.parts[0].text}
                                    </div>
                                    {msg.role === 'user' && <UserIcon className="w-8 h-8 p-1 rounded-full bg-slate-200 dark:bg-slate-600 flex-shrink-0" />}
                                </div>
                            ))}
                             <div ref={messagesEndRef} />
                        </div>

                         <button onClick={stopConversation} className="w-24 h-24 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-all-base self-center mt-auto animate-pulse">
                            <StopCircleIcon className="w-10 h-10" />
                        </button>
                        <p className="mt-4 font-semibold text-slate-600 dark:text-slate-300 text-center">Nhấn để kết thúc</p>
                    </div>
                )}

            </div>
            {!currentUser?.isVip && <UpgradeToVipPrompt featureName="Gia sư AI Live không giới hạn" setActiveFeature={setActiveFeature} />}
        </div>
    );
};

export default LiveTutor;
