import React, { useState, useEffect, useRef, useCallback } from 'react';
import FeatureHeader from './FeatureHeader';
import Loader from './Loader';
import { getMediaContent, addMediaContent } from '../services/mediaService';
import { analyzeGrammar, analyzeMediaTranscript } from '../services/geminiService';
import type { MediaContent, LyricLine, GrammarComponent, MediaAnalysisResult, VocabItem, AppFeatureProps, Badge } from '../types';
import { PlayIcon, PauseIcon, CloseIcon, SpeakerIcon, PlusIcon, SparklesIcon, BookOpenIcon, AcademicCapIcon, CheckIcon } from './icons/Icons';
import { useAuth } from '../contexts/AuthContext';
import AdminUploadModal from './AdminUploadModal';
import * as gamificationService from '../services/gamificationService';
import * as playbackPositionService from '../services/playbackPositionService';
import { useSelectionPopover } from '../contexts/SelectionPopoverContext';
import { speak } from '../services/ttsService';
import { useToast } from '../contexts/ToastContext';
import * as srsService from '../services/srsService';


const MediaLearning: React.FC<AppFeatureProps> = ({ setActiveFeature }) => {
  const { currentUser } = useAuth();
  const { addToast, showBadgeCelebration } = useToast();
  const [mediaList, setMediaList] = useState<MediaContent[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeLyricIndex, setActiveLyricIndex] = useState(-1);
  const [activeCategory, setActiveCategory] = useState<'conversation' | 'grammar'>('conversation');
  
  const [analysisResultCache, setAnalysisResultCache] = useState<Record<number, GrammarComponent[]>>({});
  const [analyzingIndex, setAnalyzingIndex] = useState<number | null>(null);
  const [openAnalysisIndex, setOpenAnalysisIndex] = useState<number | null>(null);

  const [showRomanization, setShowRomanization] = useState(true);
  const [showVietnamese, setShowVietnamese] = useState(true);
  
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [resumePrompt, setResumePrompt] = useState<{ time: number; formattedTime: string } | null>(null);

  const [mediaAnalysisResult, setMediaAnalysisResult] = useState<MediaAnalysisResult | null>(null);
  const [isAnalyzingMedia, setIsAnalyzingMedia] = useState(false);
  const [addedWords, setAddedWords] = useState<Set<string>>(new Set());


  const mediaRef = useRef<HTMLAudioElement | HTMLVideoElement | null>(null);
  const activeLyricRef = useRef<HTMLLIElement>(null);
  const lyricsContainerRef = useRef<HTMLUListElement>(null);
  const { showPopover } = useSelectionPopover();

  const handleSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !lyricsContainerRef.current) return;

    if (!lyricsContainerRef.current.contains(selection.anchorNode)) {
        return;
    }
    
    const text = selection.toString().trim();
    if (text && selection.rangeCount > 0) {
        let parent = selection.anchorNode?.parentElement;
        while(parent && parent !== lyricsContainerRef.current) {
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


  const loadMedia = useCallback(() => {
    setIsLoading(true);
    const data = getMediaContent();
    setMediaList(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  useEffect(() => {
    if (activeLyricRef.current) {
      activeLyricRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeLyricIndex]);

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleSelectMedia = useCallback((media: MediaContent | null) => {
    if (mediaRef.current) {
      mediaRef.current.pause();
    }
    setSelectedMedia(media);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setActiveLyricIndex(-1);
    setAnalysisResultCache({});
    setAnalyzingIndex(null);
    setOpenAnalysisIndex(null);
    setResumePrompt(null);
    setMediaAnalysisResult(null);
    setIsAnalyzingMedia(false);
  }, []);
  
  useEffect(() => {
    const currentMedia = selectedMedia;
    const currentMediaElement = mediaRef.current;
    const userEmail = currentUser?.email;

    return () => {
        if (currentMedia && currentMediaElement && userEmail) {
            const currentTime = currentMediaElement.currentTime;
            const duration = currentMediaElement.duration;
            if (currentTime > 5 && currentTime < duration * 0.95) {
                playbackPositionService.savePosition(currentMedia.id, currentTime);
            }
        }
    };
  }, [selectedMedia, currentUser]);

  const handleMetadataLoaded = useCallback(async () => {
    if (!mediaRef.current || !selectedMedia || !currentUser?.email) return;

    setDuration(mediaRef.current.duration);
    const savedPosition = await playbackPositionService.getPosition(selectedMedia.id);

    if (savedPosition && savedPosition > 5 && savedPosition < mediaRef.current.duration * 0.95) {
        setResumePrompt({
            time: savedPosition,
            formattedTime: formatTime(savedPosition),
        });
    }
  }, [selectedMedia, currentUser]);
  
  const handleResume = useCallback(() => {
    if (mediaRef.current && resumePrompt) {
        mediaRef.current.currentTime = resumePrompt.time;
        setCurrentTime(resumePrompt.time);
        if (!isPlaying) {
            mediaRef.current.play();
            setIsPlaying(true);
        }
    }
    setResumePrompt(null);
  }, [resumePrompt, isPlaying]);

  const handleStartOver = useCallback(async () => {
    if (mediaRef.current && selectedMedia && currentUser?.email) {
        mediaRef.current.currentTime = 0;
        setCurrentTime(0);
        await playbackPositionService.clearPosition(selectedMedia.id);
    }
    setResumePrompt(null);
  }, [selectedMedia, currentUser]);


  const handlePlayPause = useCallback(() => {
    if (mediaRef.current) {
      if (isPlaying) {
        mediaRef.current.pause();
      } else {
        mediaRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    if (mediaRef.current) {
      setCurrentTime(mediaRef.current.currentTime);
      const currentLyrics = selectedMedia?.lyrics;
      if (currentLyrics) {
        const newIndex = currentLyrics.findIndex((line, index) => {
          const nextLine = currentLyrics[index + 1];
          return (
            mediaRef.current!.currentTime >= line.timestamp &&
            (!nextLine || mediaRef.current!.currentTime < nextLine.timestamp)
          );
        });
        setActiveLyricIndex(newIndex);
      }
    }
  }, [selectedMedia]);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (mediaRef.current) {
      const newTime = parseFloat(e.target.value);
      mediaRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }, []);
  
  const handleLyricClick = useCallback((timestamp: number) => {
    if (mediaRef.current) {
      mediaRef.current.currentTime = timestamp;
      setCurrentTime(timestamp);
      if (!isPlaying) {
        mediaRef.current.play();
        setIsPlaying(true);
      }
    }
  }, [isPlaying]);

  const handleAnalyzeLyric = useCallback(async (lyric: LyricLine, index: number) => {
    if (!currentUser?.isVip || !currentUser?.email) {
      addToast({ type: 'warning', title: 'Tính năng VIP', message: 'Phân tích ngữ pháp là tính năng dành cho tài khoản VIP.' });
      return;
    }

    if (openAnalysisIndex === index) {
      setOpenAnalysisIndex(null);
      return;
    }
    
    setOpenAnalysisIndex(index);
    if (analysisResultCache[index]) {
      return; // Already cached
    }

    setAnalyzingIndex(index);
    try {
      const result = await analyzeGrammar(lyric.korean);
      setAnalysisResultCache(prev => ({ ...prev, [index]: result }));
      await gamificationService.addXp(5);
      await gamificationService.recordGrammarAnalysis();
    } catch (error) {
      console.error("Failed to analyze grammar:", error);
      setAnalysisResultCache(prev => ({ ...prev, [index]: [{ component: 'Lỗi', type: 'Lỗi', explanation: 'Không thể phân tích ngữ pháp.' }] }));
    } finally {
      setAnalyzingIndex(null);
    }
  }, [currentUser, openAnalysisIndex, analysisResultCache, addToast]);
  
  const handleGrammarAddToSrs = useCallback(async (grammarComp: GrammarComponent, fullSentence: LyricLine) => {
      if (!currentUser?.email) return;

      const vocabItem: VocabItem = {
          word: grammarComp.component,
          romanization: '', // Grammar points often don't have a direct romanization
          meaning: grammarComp.explanation,
          partOfSpeech: `Ngữ pháp (${grammarComp.type})`,
          example_sentence: fullSentence.korean,
          example_translation: fullSentence.vietnamese,
      };

      const count = await srsService.addWordsToDeck([vocabItem]);
      if (count > 0) {
          addToast({ type: 'success', title: 'Đã thêm!', message: `"${vocabItem.word}" đã được thêm vào bộ ôn tập.` });
          const { newBadges } = await gamificationService.addXp(5);
          showBadgeCelebration(newBadges);
          setAddedWords(prev => new Set(prev).add(vocabItem.word));
          setTimeout(() => {
              setAddedWords(prev => {
                  const newSet = new Set(prev);
                  newSet.delete(vocabItem.word);
                  return newSet;
              });
          }, 2000);
      } else {
          addToast({ type: 'info', title: 'Đã có', message: `"${vocabItem.word}" đã có trong bộ ôn tập của bạn.` });
      }
  }, [currentUser, addToast, showBadgeCelebration]);

  const handleAnalyzeMedia = useCallback(async () => {
      if (!selectedMedia || !selectedMedia.lyrics || isAnalyzingMedia || !currentUser?.email) return;

      if (!currentUser?.isVip) {
        addToast({ type: 'warning', title: 'Tính năng VIP', message: 'Phân tích Media bằng AI là tính năng VIP.' });
        return;
      }

      setIsAnalyzingMedia(true);
      setMediaAnalysisResult(null);
      try {
        const fullTranscript = selectedMedia.lyrics.map(line => line.korean).join('\n');
        const result = await analyzeMediaTranscript(fullTranscript);
        setMediaAnalysisResult(result);
        await gamificationService.addXp(25);
      } catch (error) {
        console.error("Failed to analyze media:", error);
        addToast({ type: 'error', title: 'Lỗi', message: 'Không thể phân tích media. Vui lòng thử lại.' });
      } finally {
        setIsAnalyzingMedia(false);
      }
    }, [selectedMedia, isAnalyzingMedia, currentUser, addToast]);

  const handleAddToSrsFromAnalysis = async (item: { word: string, meaning: string } | { point: string, explanation: string }) => {
      if (!currentUser?.email) return;
      const isGrammar = 'point' in item;
      const vocabItem: VocabItem = {
        word: isGrammar ? item.point : item.word,
        romanization: '',
        meaning: isGrammar ? item.explanation : item.meaning,
        partOfSpeech: isGrammar ? 'Ngữ pháp' : 'Từ vựng',
        example_sentence: '',
        example_translation: '',
      };

      const count = await srsService.addWordsToDeck([vocabItem]);
      if (count > 0) {
        addToast({ type: 'success', title: 'Đã thêm!', message: `"${vocabItem.word}" đã được thêm vào bộ ôn tập.` });
        await gamificationService.addXp(2);
        setAddedWords(prev => new Set(prev).add(vocabItem.word));
        setTimeout(() => {
            setAddedWords(prev => {
                const newSet = new Set(prev);
                newSet.delete(vocabItem.word);
                return newSet;
            });
        }, 2000);
      } else {
        addToast({ type: 'info', title: 'Đã có', message: `"${vocabItem.word}" đã có trong bộ ôn tập của bạn.` });
      }
    };


  const handleSaveNewMedia = useCallback((newMedia: MediaContent) => {
    setShowAdminModal(false);
    loadMedia(); // Reload the list
    handleSelectMedia(newMedia); // Immediately open the new media
  }, [loadMedia, handleSelectMedia]);
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><Loader /></div>;
  }

  const MediaGrid = ({ items }: { items: MediaContent[] }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
        {items.map(media => (
            <div key={media.id} onClick={() => handleSelectMedia(media)} className="cursor-pointer group">
            <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg transform group-hover:scale-105 transition-all-base">
                <img src={media.thumbnailUrl} alt={media.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all-base">
                <PlayIcon className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all-base" />
                </div>
            </div>
            <div className="mt-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 truncate">{media.title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{media.artistOrDrama}</p>
            </div>
            </div>
        ))}
    </div>
  );

  if (!selectedMedia) {
    const conversationMedia = mediaList.filter(m => m.category === 'conversation');
    const grammarVideos = mediaList.filter(m => m.category === 'grammar');
    
    return (
      <div>
        <div className="flex flex-wrap gap-4 justify-between items-center">
            <FeatureHeader
              title="Học qua Media"
              description="Nghe, xem và học từ vựng, ngữ pháp trong các ngữ cảnh thực tế."
            />
            {currentUser?.isAdmin && (
                <button onClick={() => setShowAdminModal(true)} className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-hanguk-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-hanguk-blue-700 transition-all-base">
                    <PlusIcon /> Thêm Media Mới
                </button>
            )}
        </div>

        <div className="mb-6 border-b-2 border-slate-200 dark:border-slate-700">
            <button onClick={() => setActiveCategory('conversation')} className={`px-4 py-2 font-semibold text-sm transition-colors ${activeCategory === 'conversation' ? 'border-b-2 border-hanguk-blue-600 text-hanguk-blue-600 dark:text-hanguk-blue-300' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}>
                Hội thoại & Nhạc
            </button>
             <button onClick={() => setActiveCategory('grammar')} className={`px-4 py-2 font-semibold text-sm transition-colors ${activeCategory === 'grammar' ? 'border-b-2 border-hanguk-blue-600 text-hanguk-blue-600 dark:text-hanguk-blue-300' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}>
                Video Ngữ pháp
            </button>
        </div>

        {mediaList.length === 0 ? (
          <p>Không có media nào.</p>
        ) : (
            activeCategory === 'conversation' ? <MediaGrid items={conversationMedia} /> : <MediaGrid items={grammarVideos} />
        )}
        {showAdminModal && <AdminUploadModal onClose={() => setShowAdminModal(false)} onSave={handleSaveNewMedia} />}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <button onClick={() => handleSelectMedia(null)} className="mb-4 text-sm font-semibold text-hanguk-blue-600 dark:text-hanguk-blue-400 hover:underline">
        &larr; Quay lại danh sách
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow min-h-0">
        <div className="lg:col-span-1 flex flex-col">
            <div className="relative">
                {selectedMedia.type === 'video' ? (
                    <video
                        ref={mediaRef as React.RefObject<HTMLVideoElement>}
                        src={selectedMedia.videoUrl}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onEnded={async () => {
                            if (!currentUser?.email) return;
                            setIsPlaying(false);
                            await gamificationService.addXp(50);
                            addToast({type: 'success', title: 'Hoàn thành!', message: 'Bạn đã xem xong media. +50XP!'});
                        }}
                        onLoadedMetadata={handleMetadataLoaded}
                        onTimeUpdate={handleTimeUpdate}
                        controls
                        className="rounded-lg shadow-lg w-full aspect-video bg-black"
                    >
                        Trình duyệt của bạn không hỗ trợ video.
                    </video>
                ) : (
                    <>
                        <img src={selectedMedia.thumbnailUrl} alt={selectedMedia.title} className="rounded-lg shadow-lg w-full aspect-square object-cover" />
                        <audio
                            ref={mediaRef as React.RefObject<HTMLAudioElement>}
                            src={selectedMedia.audioUrl}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            onEnded={async () => {
                                if (!currentUser?.email) return;
                                setIsPlaying(false);
                                await gamificationService.addXp(50);
                                addToast({type: 'success', title: 'Hoàn thành!', message: 'Bạn đã nghe xong media. +50XP!'});
                            }}
                            onLoadedMetadata={handleMetadataLoaded}
                            onTimeUpdate={handleTimeUpdate}
                            className="hidden"
                        />
                    </>
                )}
                 {resumePrompt && (
                    <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center p-4 rounded-lg animate-fade-in z-10">
                        <p className="text-white text-lg font-semibold text-center">Tiếp tục xem từ {resumePrompt.formattedTime}?</p>
                        <div className="mt-4 flex gap-4">
                            <button onClick={handleResume} className="px-6 py-2 bg-hanguk-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-hanguk-blue-700">Tiếp tục</button>
                            <button onClick={handleStartOver} className="px-6 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700">Xem lại</button>
                        </div>
                    </div>
                )}
            </div>

          <h2 className="text-xl md:text-2xl font-bold mt-4 text-slate-800 dark:text-white">{selectedMedia.title}</h2>
          <p className="text-base md:text-lg text-slate-500 dark:text-slate-400">{selectedMedia.artistOrDrama}</p>
          
          <div className="mt-4">
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <button onClick={handlePlayPause} className="p-4 bg-hanguk-blue-600 text-white rounded-full shadow-lg hover:bg-hanguk-blue-700 transition-transform hover:scale-110">
              {isPlaying ? <PauseIcon className="w-8 h-8"/> : <PlayIcon className="w-8 h-8"/>}
            </button>
          </div>

          <div className="mt-4">
            <button
                onClick={handleAnalyzeMedia}
                disabled={isAnalyzingMedia || !!mediaAnalysisResult}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-hanguk-blue-600 to-cyan-500 text-white font-bold rounded-lg shadow-md hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {isAnalyzingMedia ? <Loader /> : <SparklesIcon />}
                {isAnalyzingMedia ? 'AI đang phân tích...' : (mediaAnalysisResult ? 'Đã phân tích' : 'AI Phân tích Media')}
            </button>
        </div>

          <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
            <h4 className="font-semibold text-md mb-2">Tùy chỉnh hiển thị</h4>
            <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                    <label htmlFor="show-romanization">Hiển thị Romanization</label>
                    <input type="checkbox" id="show-romanization" checked={showRomanization} onChange={e => setShowRomanization(e.target.checked)} className="rounded text-hanguk-blue-500"/>
                </div>
                <div className="flex items-center justify-between">
                    <label htmlFor="show-vietnamese">Hiển thị Tiếng Việt</label>
                    <input type="checkbox" id="show-vietnamese" checked={showVietnamese} onChange={e => setShowVietnamese(e.target.checked)} className="rounded text-hanguk-blue-500"/>
                </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2 flex flex-col min-h-0">
          <h3 className="text-xl font-bold mb-4 flex-shrink-0">Lời thoại / Phụ đề</h3>
          <ul ref={lyricsContainerRef} className="flex-grow overflow-y-auto pr-2 space-y-2">
            {(selectedMedia.lyrics || []).map((lyric, index) => (
              <li key={index} ref={activeLyricIndex === index ? activeLyricRef : null} className={`p-4 rounded-lg transition-colors ${activeLyricIndex === index ? 'bg-hanguk-blue-100 dark:bg-hanguk-blue-900/50' : 'bg-white dark:bg-slate-800'}`}>
                <div className="flex justify-between items-start">
                  <div onClick={() => handleLyricClick(lyric.timestamp)} className="flex-grow cursor-pointer">
                    <p 
                      data-selectable="true"
                      className="font-bold text-lg text-slate-800 dark:text-slate-200 cursor-pointer hover:text-hanguk-blue-600 dark:hover:text-hanguk-blue-400 transition-colors"
                      onClick={(e) => { e.stopPropagation(); handleAnalyzeLyric(lyric, index); }}
                    >
                      {lyric.korean}
                    </p>
                    {showRomanization && <p className="text-md text-cyan-600 dark:text-cyan-400 italic break-all">{lyric.romanization}</p>}
                    {showVietnamese && <p className="text-md text-slate-500 dark:text-slate-400 mt-1">"{lyric.vietnamese}"</p>}
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-2 ml-2">
                    <button onClick={() => speak(lyric.korean)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600" title="Nghe"><SpeakerIcon small /></button>
                  </div>
                </div>
                {openAnalysisIndex === index && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 animate-fade-in">
                    {analyzingIndex === index ? <Loader /> : analysisResultCache[index] ? (
                      <div className="space-y-2 text-sm">
                        {analysisResultCache[index].map((comp, i) => (
                            <div key={i} className="flex justify-between items-start gap-2 p-2 bg-slate-200/50 dark:bg-slate-800/50 rounded-md">
                                <div className="flex-grow">
                                    <p>
                                        <span className="font-bold text-hanguk-blue-700 dark:text-hanguk-blue-400">{comp.component}</span>
                                        <span className="text-slate-500 dark:text-slate-400 italic ml-2">({comp.type})</span>
                                    </p>
                                    <p className="text-slate-600 dark:text-slate-300">{comp.explanation}</p>
                                </div>
                                <button 
                                    onClick={() => handleGrammarAddToSrs(comp, lyric)} 
                                    className="flex-shrink-0 p-2 rounded-full text-slate-500 hover:bg-slate-300 dark:hover:bg-slate-700" 
                                    title="Thêm vào SRS"
                                >
                                    {addedWords.has(comp.component) ? <CheckIcon small /> : <PlusIcon small />}
                                </button>
                            </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                )}
              </li>
            ))}
          </ul>
           {isAnalyzingMedia && (
                <div className="mt-6 flex flex-col items-center justify-center">
                    <Loader />
                    <p className="mt-2 text-slate-500 dark:text-slate-400">AI đang quét lời thoại...</p>
                </div>
            )}

            {mediaAnalysisResult && (
                <div className="mt-6 space-y-6 animate-fade-in">
                    {/* Vocabulary Section */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                        <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-slate-700 dark:text-slate-200">
                            <BookOpenIcon /> Từ vựng cốt lõi
                        </h4>
                        <div className="space-y-2">
                            {mediaAnalysisResult.vocabulary.map((item, index) => (
                                <div key={index} className="flex justify-between items-center p-2 bg-white dark:bg-slate-800 rounded-md">
                                    <div>
                                        <p className="font-bold text-hanguk-blue-800 dark:text-hanguk-blue-300">{item.word}</p>
                                        <p className="text-sm text-slate-500">{item.meaning}</p>
                                    </div>
                                    <button onClick={() => handleAddToSrsFromAnalysis(item)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700" title="Thêm vào SRS">
                                        {addedWords.has(item.word) ? <CheckIcon small /> : <PlusIcon small />}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Grammar Section */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                        <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-slate-700 dark:text-slate-200">
                            <AcademicCapIcon /> Điểm ngữ pháp chính
                        </h4>
                        <div className="space-y-3">
                            {mediaAnalysisResult.grammar.map((item, index) => (
                                 <div key={index} className="p-2 bg-white dark:bg-slate-800 rounded-md">
                                     <div className="flex justify-between items-start">
                                        <p className="font-bold text-hanguk-blue-800 dark:text-hanguk-blue-300">{item.point}</p>
                                        <button onClick={() => handleAddToSrsFromAnalysis(item)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 -mt-1" title="Thêm vào SRS">
                                            {addedWords.has(item.point) ? <CheckIcon small /> : <PlusIcon small />}
                                        </button>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{item.explanation}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
      {showAdminModal && <AdminUploadModal onClose={() => setShowAdminModal(false)} onSave={handleSaveNewMedia} />}
    </div>
  );
};

export default MediaLearning;