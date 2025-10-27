import React, { useState, useRef, useEffect, useCallback } from 'react';
import { hangeulData } from '../services/hangeulData';
import type { HangeulChar, Point, HandwritingFeedback } from '../types';
import FeatureHeader from './FeatureHeader';
import * as gamificationService from '../services/gamificationService';
import * as geminiService from '../services/geminiService';
import { useAuth } from '../contexts/AuthContext';
import Loader from './Loader';
import CircularProgress from './CircularProgress';
import { SparklesIcon } from './icons/Icons';
import { useToast } from '../contexts/ToastContext';

const CHECKPOINT_RADIUS = 25;
const STROKE_WIDTH_GUIDE = 20;
const STROKE_WIDTH_USER = 12;

const HandwritingPractice: React.FC = () => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
    const [selectedCharIndex, setSelectedCharIndex] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    
    // State for Learn Mode
    const [currentStroke, setCurrentStroke] = useState(0);
    const [completedCheckpoints, setCompletedCheckpoints] = useState<boolean[]>([]);
    
    // State for Test Mode
    const [mode, setMode] = useState<'learn' | 'test'>('learn');
    const [userStrokes, setUserStrokes] = useState<Point[][]>([]);
    const [feedback, setFeedback] = useState<HandwritingFeedback | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const selectedChar: HangeulChar = hangeulData[selectedGroupIndex].chars[selectedCharIndex];

    const resetForChar = useCallback(() => {
        // Learn mode reset
        setCurrentStroke(0);
        const totalCheckpoints = selectedChar.checkpoints.flat().length;
        setCompletedCheckpoints(Array(totalCheckpoints).fill(false));
        // Test mode reset
        setUserStrokes([]);
        setFeedback(null);
        setIsAnalyzing(false);
    }, [selectedChar]);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (mode === 'learn') {
            // Draw guide strokes (all future strokes)
            ctx.strokeStyle = '#e2e8f0'; // slate-200
            ctx.lineWidth = STROKE_WIDTH_GUIDE;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            for(let i = currentStroke; i < selectedChar.strokes.length; i++){
                ctx.beginPath();
                ctx.moveTo(selectedChar.strokes[i][0].x * 2, selectedChar.strokes[i][0].y * 2);
                selectedChar.strokes[i].forEach(p => ctx.lineTo(p.x * 2, p.y * 2));
                ctx.stroke();
            }

            // Draw checkpoints for the current stroke
            const currentStrokeCheckpoints = selectedChar.checkpoints[currentStroke] || [];
            let checkpointGlobalIndex = selectedChar.checkpoints.slice(0, currentStroke).flat().length;

            currentStrokeCheckpoints.forEach((cp, index) => {
                ctx.beginPath();
                ctx.arc(cp.x * 2, cp.y * 2, (cp.radius || CHECKPOINT_RADIUS) * 1.5, 0, 2 * Math.PI);
                ctx.fillStyle = completedCheckpoints[checkpointGlobalIndex + index] ? 'rgba(74, 222, 128, 0.5)' : 'rgba(251, 146, 60, 0.4)';
                ctx.fill();
            });
        } else { // Test mode drawing
            // Draw grid lines
            ctx.strokeStyle = '#f1f5f9'; // slate-100
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, 0); ctx.lineTo(canvas.width / 2, canvas.height);
            ctx.moveTo(0, canvas.height / 2); ctx.lineTo(canvas.width, canvas.height / 2);
            ctx.stroke();

            // Draw user strokes
            ctx.strokeStyle = '#1e293b'; // slate-800
            ctx.lineWidth = STROKE_WIDTH_USER;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            userStrokes.forEach(stroke => {
                if(stroke.length === 0) return;
                ctx.beginPath();
                ctx.moveTo(stroke[0].x, stroke[0].y);
                stroke.forEach(p => ctx.lineTo(p.x, p.y));
                ctx.stroke();
            });
        }
    }, [selectedChar, currentStroke, completedCheckpoints, mode, userStrokes]);

    useEffect(() => {
        resetForChar();
    }, [selectedChar, resetForChar]);
    
    useEffect(() => {
        // Reset state when mode changes
        resetForChar();
    }, [mode, resetForChar]);

    useEffect(() => {
        draw();
    }, [draw, completedCheckpoints, userStrokes]);


    const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent): Point => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const touch = 'touches' in e ? e.touches[0] : e;
        return {
            x: (touch.clientX - rect.left) / rect.width * canvas.width,
            y: (touch.clientY - rect.top) / rect.height * canvas.height,
        };
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        setIsDrawing(true);
        const pos = getCanvasCoords(e);
        if (mode === 'learn') {
            checkPointCompletion(pos);
        } else {
            setUserStrokes(prev => [...prev, [pos]]);
        }
    };

    const stopDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        setIsDrawing(false);
    };

    const drawOnCanvas = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        e.preventDefault();
        const pos = getCanvasCoords(e);
        if (mode === 'learn') {
            checkPointCompletion(pos);
        } else {
            setUserStrokes(prev => {
                const newStrokes = [...prev];
                newStrokes[newStrokes.length - 1].push(pos);
                return newStrokes;
            });
        }
    };

    const checkPointCompletion = (pos: Point) => {
        if (!currentUser?.email) return;
        const currentStrokeCheckpoints = selectedChar.checkpoints[currentStroke] || [];
        let checkpointGlobalIndexOffset = selectedChar.checkpoints.slice(0, currentStroke).flat().length;

        currentStrokeCheckpoints.forEach((cp, index) => {
            const distance = Math.hypot((cp.x * 2) - pos.x, (cp.y * 2) - pos.y);
            if (distance < (cp.radius || CHECKPOINT_RADIUS) * 1.5) {
                const globalIndex = checkpointGlobalIndexOffset + index;
                if (!completedCheckpoints[globalIndex]) {
                    setCompletedCheckpoints(prev => {
                        const newCompleted = [...prev];
                        newCompleted[globalIndex] = true;
                        
                        const newStrokeCompleted = selectedChar.checkpoints[currentStroke].every((_, i) => newCompleted[checkpointGlobalIndexOffset + i]);
                        
                        if (newStrokeCompleted) {
                            if (currentStroke < selectedChar.strokes.length - 1) {
                                setCurrentStroke(s => s + 1);
                            } else {
                                gamificationService.addXp(5);
                                setTimeout(() => {
                                    addToast({ type: 'success', title: 'Hoàn thành!', message: `Bạn đã viết xong chữ ${selectedChar.char}. Tốt lắm!`});
                                }, 300);
                            }
                        }
                        return newCompleted;
                    });
                }
            }
        });
    };

    const handleGetFeedback = async () => {
        if (!currentUser?.isVip || !currentUser?.email) {
            addToast({ type: 'warning', title: 'Tính năng VIP', message: 'Kiểm tra với AI là tính năng dành cho tài khoản VIP.' });
            return;
        }
        if (!canvasRef.current || userStrokes.length === 0) return;
        
        setIsAnalyzing(true);
        setFeedback(null);
        try {
            const canvas = canvasRef.current;
            const base64Image = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
            const result = await geminiService.getHandwritingFeedback(base64Image, 'image/jpeg', selectedChar.char);
            setFeedback(result);
            if(result) await gamificationService.addXp(result.score * 2);
        } catch (error) {
            console.error(error);
            setFeedback({ score: 0, positiveFeedback: "Lỗi", improvementTip: "Đã có lỗi xảy ra khi phân tích chữ viết của bạn." });
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <FeatureHeader
                title="Luyện viết tay Hangeul"
                description="Học cách viết các ký tự tiếng Hàn với hướng dẫn thứ tự nét và nhận phản hồi từ AI."
            />
            <div className="flex gap-2 mb-4">
                 <button onClick={() => setMode('learn')} className={`px-4 py-2 rounded-lg font-semibold transition-colors ${mode === 'learn' ? 'bg-hanguk-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>
                    ✏️ Luyện tập (Tô chữ)
                </button>
                 <button onClick={() => setMode('test')} className={`px-4 py-2 rounded-lg font-semibold transition-colors ${mode === 'test' ? 'bg-hanguk-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>
                    ✅ Kiểm tra (Viết tự do)
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="md:col-span-1">
                    <div className="mb-4">
                        <label className="font-semibold">Nhóm chữ:</label>
                        <select value={selectedGroupIndex} onChange={e => { setSelectedGroupIndex(Number(e.target.value)); setSelectedCharIndex(0); }} className="w-full p-2 mt-1 rounded-md bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600">
                            {hangeulData.map((group, index) => <option key={group.title} value={index}>{group.title}</option>)}
                        </select>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto pr-2">
                        {hangeulData[selectedGroupIndex].chars.map((char, index) => (
                            <button key={char.char} onClick={() => setSelectedCharIndex(index)} className={`w-full text-left p-2 rounded-md mb-1 transition-colors ${selectedCharIndex === index ? 'bg-hanguk-blue-100 dark:bg-hanguk-blue-900' : 'hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                                <span className="text-2xl font-bold">{char.char}</span> {char.name} ({char.romanization})
                            </button>
                        ))}
                    </div>
                </div>

                <div className="md:col-span-2">
                     <div className="aspect-square bg-white dark:bg-slate-800 rounded-lg shadow-lg p-2">
                         <canvas
                            ref={canvasRef}
                            width={400}
                            height={400}
                            className="w-full h-full touch-none rounded-md"
                            onMouseDown={startDrawing}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onMouseMove={drawOnCanvas}
                            onTouchStart={startDrawing}
                            onTouchEnd={stopDrawing}
                            onTouchMove={drawOnCanvas}
                         />
                    </div>
                    <div className="mt-4 flex gap-2">
                        <button onClick={resetForChar} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 rounded-lg font-semibold">
                            {mode === 'learn' ? 'Thử lại' : 'Xóa'}
                        </button>
                        {mode === 'test' && (
                             <button onClick={handleGetFeedback} disabled={isAnalyzing || userStrokes.length === 0} className="px-4 py-2 bg-hanguk-blue-600 text-white rounded-lg font-semibold flex items-center gap-1 disabled:bg-slate-400">
                                {isAnalyzing ? <Loader /> : <SparklesIcon small />}
                                {isAnalyzing ? 'Đang phân tích...' : 'Kiểm tra với AI'}
                            </button>
                        )}
                    </div>
                    {mode === 'test' && feedback && (
                        <div className="mt-4 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md animate-fade-in-up">
                            <h3 className="font-bold text-lg mb-4 text-center">Phân tích từ AI</h3>
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <div className="flex-shrink-0">
                                    <CircularProgress score={feedback.score * 10} />
                                </div>
                                <div className="flex-grow space-y-3 text-sm">
                                    <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-md">
                                        <p className="font-semibold text-green-800 dark:text-green-300">Điểm tốt:</p>
                                        <p>{feedback.positiveFeedback}</p>
                                    </div>
                                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900/50 rounded-md">
                                        <p className="font-semibold text-yellow-800 dark:text-yellow-300">Góp ý:</p>
                                        <p>{feedback.improvementTip}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HandwritingPractice;