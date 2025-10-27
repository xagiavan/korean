import React, { useState, useRef, useCallback } from 'react';
import FeatureHeader from './FeatureHeader';
import Loader from './Loader';
import { useAuth } from '../contexts/AuthContext';
import UpgradeToVipPrompt from './UpgradeToVipPrompt';
import { identifyObjectsInImage } from '../services/geminiService';
import * as srsService from '../services/srsService';
import type { IdentifiedObject, VocabItem, AppFeatureProps } from '../types';
import { CameraIcon, UploadIcon, PlusIcon, RefreshIcon, XCircleIcon } from './icons/Icons';
import * as gamificationService from '../services/gamificationService';
import { useToast } from '../contexts/ToastContext';

const ImageRecognition: React.FC<AppFeatureProps> = ({ setActiveFeature }) => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const [imageSrcs, setImageSrcs] = useState<string[]>([]);
    const [results, setResults] = useState<IdentifiedObject[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [confirmation, setConfirmation] = useState<{ top: number, left: number, key: number } | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const stopCameraStream = useCallback(() => {
        if (videoRef.current?.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    }, []);

    const resetState = useCallback(() => {
        setImageSrcs([]);
        setResults([]);
        setIsLoading(false);
        setError(null);
        if (isCameraOpen) {
            stopCameraStream();
            setIsCameraOpen(false);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, [isCameraOpen, stopCameraStream]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setResults([]);
            setError(null);
            const filePromises = Array.from(files).map((file: File) => {
                return new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target?.result as string);
                    reader.onerror = (err) => reject(err);
                    reader.readAsDataURL(file);
                });
            });

            setIsLoading(true); // Show loader while processing files
            Promise.all(filePromises).then(newImageSrcs => {
                setImageSrcs(prev => [...prev, ...newImageSrcs]);
            }).catch(err => {
                console.error("Error reading files:", err);
                setError("Có lỗi khi đọc file ảnh.");
            }).finally(() => {
                setIsLoading(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = ""; // Allow re-uploading the same file
                }
            });
        }
    };

    const startCamera = async () => {
        // No full reset, we want to add to existing images
        if (isCameraOpen) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setIsCameraOpen(true);
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            }, 0);
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập của trình duyệt.");
        }
    };
    
    const handleCapture = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            const dataUrl = canvas.toDataURL('image/jpeg');
            setImageSrcs(prev => [...prev, dataUrl]);
            setResults([]);
            setError(null);
            stopCameraStream();
            setIsCameraOpen(false);
        }
    };

    const handleIdentifyAll = async () => {
        if (imageSrcs.length === 0 || !currentUser?.email) return;
        if (!currentUser?.isVip) {
            setError('VIP_REQUIRED');
            addToast({ type: 'warning', title: 'Tính năng VIP', message: 'Nhận diện ảnh là tính năng VIP.' });
            return;
        }

        setIsLoading(true);
        setError(null);
        setResults([]);

        try {
            const analysisPromises = imageSrcs.map(src => {
                const base64Data = src.split(',')[1];
                const mimeType = src.match(/:(.*?);/)?.[1] || 'image/jpeg';
                return identifyObjectsInImage(base64Data, mimeType);
            });

            const allResultsNested = await Promise.all(analysisPromises);
            
            const flatResults = allResultsNested.flat().filter((item): item is IdentifiedObject => item !== null);
            
            if (flatResults.length > 0) {
                // Remove duplicates based on the Korean word
                const uniqueResults = [...new Map(flatResults.map(item => [item.korean, item])).values()];
                setResults(uniqueResults);
                await gamificationService.addXp(20 * imageSrcs.length);
            } else {
                setError("Không thể nhận diện vật thể nào trong các ảnh đã chọn. Vui lòng thử ảnh khác rõ ràng hơn.");
            }
        } catch (err) {
            console.error("Identification failed:", err);
            setError("Đã xảy ra lỗi trong quá trình phân tích ảnh.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleAddToSrs = async (item: IdentifiedObject, event: React.MouseEvent<HTMLButtonElement>) => {
        if (!currentUser?.email) return;
        const vocabItem: VocabItem = {
            word: item.korean,
            romanization: item.romanization,
            meaning: item.vietnamese,
            partOfSpeech: 'Danh từ',
            example_sentence: '',
            example_translation: '',
        };
        const count = await srsService.addWordsToDeck([vocabItem]);
         if (count > 0) {
            addToast({ type: 'success', title: 'Đã thêm!', message: `"${item.korean}" đã được thêm vào bộ ôn tập.` });
            await gamificationService.addXp(2);
            await gamificationService.checkSrsBadges();
        } else {
            addToast({ type: 'info', title: 'Đã có', message: `"${item.korean}" đã có trong bộ ôn tập của bạn.` });
        }
    }

    const removeImage = (indexToRemove: number) => {
        setImageSrcs(prev => prev.filter((_, index) => index !== indexToRemove));
        // If removing an image invalidates current results, clear them
        if (results.length > 0) {
            setResults([]);
        }
    };

    if (isCameraOpen) {
        return (
             <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-4 animate-fade-in">
                <video ref={videoRef} autoPlay playsInline className="w-full max-w-2xl h-auto rounded-lg mb-4 border-4 border-slate-700"></video>
                <canvas ref={canvasRef} className="hidden"></canvas>
                <div className="flex gap-4">
                    <button onClick={handleCapture} className="px-8 py-4 bg-hanguk-blue-600 text-white font-bold rounded-full shadow-lg text-lg hover:bg-hanguk-blue-700 transition-transform hover:scale-105">Chụp & Thêm ảnh</button>
                    <button onClick={() => { stopCameraStream(); setIsCameraOpen(false); }} className="px-6 py-3 bg-slate-600 text-white font-bold rounded-lg shadow-md hover:bg-slate-700">Hủy</button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <FeatureHeader
                title="Đây là gì? - Nhận diện qua ảnh"
                description="Chụp hoặc tải lên một hoặc nhiều ảnh để AI cho bạn biết tên tiếng Hàn của các vật thể."
            />
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" multiple />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Left Column: Image Previews & Controls */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md space-y-4">
                    <h3 className="font-bold text-lg">Ảnh đã chọn ({imageSrcs.length})</h3>
                    {imageSrcs.length === 0 ? (
                         <div className="text-center py-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg">
                            <p className="text-slate-500">Chưa có ảnh nào được chọn.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {imageSrcs.map((src, index) => (
                                <div key={index} className="relative group">
                                    <img src={src} alt={`Uploaded preview ${index}`} className="w-full h-24 object-cover rounded-md" />
                                    <button onClick={() => removeImage(index)} className="absolute top-1 right-1 p-0.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        <XCircleIcon small/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-2">
                        <button onClick={() => fileInputRef.current?.click()} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                           <UploadIcon /> Tải ảnh lên
                        </button>
                         <button onClick={startCamera} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                           <CameraIcon /> Dùng Camera
                        </button>
                    </div>
                     <button onClick={resetState} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                       <RefreshIcon small/> Bắt đầu lại
                    </button>
                </div>

                {/* Right Column: Results */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md min-h-[300px]">
                    <h3 className="font-bold text-lg mb-4">Kết quả nhận diện</h3>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-48"><Loader /></div>
                    ) : error === 'VIP_REQUIRED' ? (
                        <UpgradeToVipPrompt featureName="nhận diện vật thể" setActiveFeature={setActiveFeature as any} />
                    ) : error ? (
                        <p className="text-red-500 text-center">{error}</p>
                    ) : results.length > 0 ? (
                        <div className="space-y-3">
                            {results.map((item, index) => (
                                <div key={index} className="flex justify-between items-center p-3 bg-slate-100 dark:bg-slate-700 rounded-md">
                                    <div>
                                        <p className="font-bold text-lg">{item.korean}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{item.romanization} - {item.vietnamese}</p>
                                    </div>
                                    <button onClick={(e) => handleAddToSrs(item, e)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600" title="Thêm vào SRS">
                                        <PlusIcon />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-slate-500">
                                {imageSrcs.length > 0 
                                    ? "Nhấn 'Nhận diện' để bắt đầu phân tích."
                                    : "Thêm ảnh để bắt đầu."
                                }
                            </p>
                        </div>
                    )}

                    {imageSrcs.length > 0 && (
                        <div className="mt-6 text-center">
                            <button onClick={handleIdentifyAll} disabled={isLoading} className="px-8 py-3 bg-hanguk-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-hanguk-blue-700 disabled:bg-slate-400">
                                Nhận diện
                            </button>
                        </div>
                    )}
                </div>
            </div>
             {confirmation && (
                <div
                    key={confirmation.key}
                    className="fixed z-50 flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full animate-fly-up-fade-out pointer-events-none"
                    style={{ top: confirmation.top, left: confirmation.left, transform: 'translateX(-50%)' }}
                >
                    <PlusIcon small /> SRS
                </div>
            )}
        </div>
    );
};

export default ImageRecognition;