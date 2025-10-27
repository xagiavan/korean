import React, { useState, useRef, useEffect } from 'react';
import type { MediaContent, LyricLine } from '../types';
import { addMediaContent } from '../services/mediaService';
import * as geminiService from '../services/geminiService';
import { CloseIcon, UploadIcon, InformationCircleIcon, PlusIcon } from './icons/Icons';
import Loader from './Loader';
import { useToast } from '../contexts/ToastContext';

interface AdminUploadModalProps {
  onClose: () => void;
  onSave: (newMedia: MediaContent) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const AdminUploadModal: React.FC<AdminUploadModalProps> = ({ onClose, onSave }) => {
  const { addToast } = useToast();
  const [title, setTitle] = useState('');
  const [artistOrDrama, setArtistOrDrama] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [koreanTranscript, setKoreanTranscript] = useState('');
  const [category, setCategory] = useState<'conversation' | 'grammar'>('conversation');
  
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editableLyrics, setEditableLyrics] = useState<LyricLine[] | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioDuration, setAudioDuration] = useState(0);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setAudioFile(file);
        const url = URL.createObjectURL(file);
        if(audioRef.current) {
            audioRef.current.src = url;
        }
    }
  };
  
  const handleAudioMetadataLoaded = () => {
    if (audioRef.current) {
        setAudioDuration(audioRef.current.duration);
    }
  };

  const handleGenerateSubtitles = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !artistOrDrama || !thumbnailFile || !audioFile || !koreanTranscript.trim()) {
        setError('Vui lòng điền đầy đủ tất cả các trường và chọn đủ file.');
        return;
    }
    if(audioDuration === 0) {
        setError('Không thể đọc thời lượng file âm thanh. Vui lòng thử lại với file khác.');
        return;
    }
    
    setError(null);
    setIsProcessing(true);

    try {
        const generatedLyrics = await geminiService.generateLyricsFromTranscript(koreanTranscript);
        
        if (!Array.isArray(generatedLyrics) || generatedLyrics.length === 0) {
            throw new Error("AI không thể xử lý lời thoại. Vui lòng kiểm tra lại nội dung tiếng Hàn hoặc thử lại.");
        }
        
        const durationPerLine = audioDuration / generatedLyrics.length;
        const lyrics: LyricLine[] = generatedLyrics.map((line, index) => ({
            ...line,
            timestamp: parseFloat((index * durationPerLine).toFixed(2)),
        }));
        setEditableLyrics(lyrics);
    } catch (err: any) {
        console.error("Subtitle generation failed:", err);
        setError(err.message || 'Đã xảy ra lỗi không xác định trong quá trình xử lý phụ đề.');
    } finally {
        setIsProcessing(false);
    }
  };

  const handleFinalSave = async () => {
    if (!editableLyrics || !thumbnailFile || !audioFile) {
        setError('Dữ liệu không hợp lệ để lưu.');
        return;
    }

    // Timestamp validation
    for (let i = 1; i < editableLyrics.length; i++) {
        if (editableLyrics[i].timestamp < editableLyrics[i-1].timestamp) {
            addToast({type: 'error', title: 'Lỗi Timestamp', message: `Timestamp ở dòng ${i + 1} không thể nhỏ hơn dòng trước đó.`});
            return;
        }
    }

    setIsProcessing(true);
    try {
        const [thumbnailUrl, audioUrl] = await Promise.all([
            fileToBase64(thumbnailFile),
            fileToBase64(audioFile)
        ]);
        
        const newMedia: MediaContent = {
            id: `media-${Date.now()}`,
            type: 'audio',
            category,
            title,
            artistOrDrama,
            thumbnailUrl,
            audioUrl,
            lyrics: editableLyrics,
        };

        addMediaContent(newMedia);
        onSave(newMedia);
    } catch (err: any) {
        setError(err.message || 'Lỗi khi chuyển đổi file.');
    } finally {
        setIsProcessing(false);
    }
  };

  const handleLyricChange = (index: number, field: keyof LyricLine, value: string | number) => {
    if (!editableLyrics) return;
    const newLyrics = [...editableLyrics];
    const newLyric = { ...newLyrics[index] };
    if (field === 'timestamp' && typeof value === 'string') {
        newLyric[field] = parseFloat(value) || 0;
    } else {
        (newLyric[field] as any) = value;
    }
    newLyrics[index] = newLyric;
    setEditableLyrics(newLyrics);
  };
  
  const handleAddLine = (index: number) => {
    if (!editableLyrics) return;
    const newLyrics = [...editableLyrics];
    const newLine: LyricLine = { timestamp: editableLyrics[index]?.timestamp + 0.1 || 0, korean: '', romanization: '', vietnamese: '' };
    newLyrics.splice(index + 1, 0, newLine);
    setEditableLyrics(newLyrics);
  };

  const handleDeleteLine = (index: number) => {
    if (!editableLyrics) return;
    const newLyrics = editableLyrics.filter((_, i) => i !== index);
    setEditableLyrics(newLyrics);
  };

  if (editableLyrics) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b dark:border-slate-700">
                    <h2 className="text-xl font-bold">Chỉnh sửa Phụ đề</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"><CloseIcon /></button>
                </div>
                <div className="p-4 overflow-y-auto">
                    <div className="grid grid-cols-[80px_1fr_1fr_1fr_50px] gap-x-2 font-semibold text-sm mb-2 px-2">
                        <span>Thời gian (s)</span>
                        <span>Tiếng Hàn</span>
                        <span>Romanization</span>
                        <span>Tiếng Việt</span>
                        <span></span>
                    </div>
                    {editableLyrics.map((lyric, index) => (
                        <div key={index} className="grid grid-cols-[80px_1fr_1fr_1fr_50px] gap-x-2 items-start mb-2">
                            <input
                                type="number"
                                step="0.1"
                                value={lyric.timestamp}
                                onChange={(e) => handleLyricChange(index, 'timestamp', e.target.value)}
                                className="w-full p-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-sm"
                            />
                            <textarea value={lyric.korean} onChange={(e) => handleLyricChange(index, 'korean', e.target.value)} rows={2} className="w-full p-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-sm" />
                            <textarea value={lyric.romanization} onChange={(e) => handleLyricChange(index, 'romanization', e.target.value)} rows={2} className="w-full p-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-sm" />
                            <textarea value={lyric.vietnamese} onChange={(e) => handleLyricChange(index, 'vietnamese', e.target.value)} rows={2} className="w-full p-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-sm" />
                            <div className="flex flex-col items-center gap-1">
                                <button onClick={() => handleDeleteLine(index)} className="p-1 text-red-500 hover:bg-red-100 rounded-full" title="Xóa dòng"><CloseIcon small /></button>
                                <button onClick={() => handleAddLine(index)} className="p-1 text-green-500 hover:bg-green-100 rounded-full" title="Thêm dòng mới bên dưới"><PlusIcon small /></button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="pt-4 p-6 border-t dark:border-slate-700 flex justify-between items-center">
                    <button type="button" onClick={() => setEditableLyrics(null)} disabled={isProcessing} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 font-semibold rounded-lg hover:bg-slate-300 disabled:opacity-50">
                        Quay lại
                    </button>
                    <button type="button" onClick={handleFinalSave} disabled={isProcessing} className="px-6 py-2 bg-hanguk-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-hanguk-blue-700 disabled:bg-slate-400 flex items-center gap-2">
                        {isProcessing ? <><Loader /> Đang lưu...</> : 'Lưu Media'}
                    </button>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b dark:border-slate-700">
          <h2 className="text-xl font-bold">Thêm Media Mới (Tự động)</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
            <CloseIcon />
          </button>
        </div>
        
        <form onSubmit={handleGenerateSubtitles} className="p-6 space-y-4 overflow-y-auto">
            {error && <div className="p-3 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg text-sm">{error}</div>}
            
            <audio ref={audioRef} onLoadedMetadata={handleAudioMetadataLoaded} className="hidden" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="title" className="block mb-1 font-semibold text-sm">Tiêu đề</label>
                    <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-2 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus-ring" />
                </div>
                <div>
                    <label htmlFor="artist" className="block mb-1 font-semibold text-sm">Nghệ sĩ / Phim</label>
                    <input type="text" id="artist" value={artistOrDrama} onChange={e => setArtistOrDrama(e.target.value)} required className="w-full p-2 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus-ring" />
                </div>
            </div>

            <div>
                <label htmlFor="category" className="block mb-1 font-semibold text-sm">Thể loại</label>
                <select id="category" value={category} onChange={e => setCategory(e.target.value as 'conversation' | 'grammar')} required className="w-full p-2 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus-ring">
                    <option value="conversation">Hội thoại & Nhạc</option>
                    <option value="grammar">Ngữ pháp</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div>
                    <label className="block mb-1 font-semibold text-sm">1. Tải Ảnh thumbnail</label>
                    <input type="file" accept="image/*" onChange={handleThumbnailChange} required className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-hanguk-blue-50 file:text-hanguk-blue-700 hover:file:bg-hanguk-blue-100" />
                    {thumbnailPreview && <img src={thumbnailPreview} alt="Xem trước" className="mt-2 rounded-lg w-full h-32 object-cover" />}
                </div>

                <div>
                     <label className="block mb-1 font-semibold text-sm">2. Tải File Âm thanh (.mp3)</label>
                     <input type="file" accept="audio/mpeg" onChange={handleAudioFileChange} required className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-hanguk-blue-50 file:text-hanguk-blue-700 hover:file:bg-hanguk-blue-100" />
                </div>
            </div>
            
            <div>
                 <label htmlFor="transcript" className="block mb-1 font-semibold text-sm">3. Dán toàn bộ lời thoại tiếng Hàn</label>
                 <textarea
                    id="transcript"
                    value={koreanTranscript}
                    onChange={(e) => setKoreanTranscript(e.target.value)}
                    placeholder="Dán toàn bộ lời thoại tiếng Hàn vào đây. AI sẽ tự động tách câu, dịch và thêm mốc thời gian."
                    rows={5}
                    required
                    className="w-full p-2 border-2 border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-700 focus-ring"
                 />
            </div>
            
            <div className="mt-2 p-3 bg-cyan-50 dark:bg-cyan-900/50 rounded-lg text-sm text-cyan-800 dark:text-cyan-200 flex gap-2">
                <InformationCircleIcon className="w-8 h-8 flex-shrink-0" />
                <div>
                    <span className="font-bold">Hướng dẫn:</span> AI sẽ tạo một bản nháp phụ đề. Sau đó bạn có thể chỉnh sửa thủ công để đạt độ chính xác tuyệt đối.
                </div>
            </div>
            
            <div className="pt-4 border-t dark:border-slate-700 flex justify-end gap-3">
                <button type="button" onClick={onClose} disabled={isProcessing} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 font-semibold rounded-lg hover:bg-slate-300 disabled:opacity-50">
                    Hủy
                </button>
                <button type="submit" disabled={isProcessing || audioDuration === 0} className="px-6 py-2 bg-hanguk-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-hanguk-blue-700 disabled:bg-slate-400 flex items-center gap-2">
                    {isProcessing ? <><Loader /> Đang xử lý...</> : 'Tạo Phụ đề & Chỉnh sửa'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUploadModal;