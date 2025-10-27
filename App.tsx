import React, { useState, lazy, Suspense, useCallback, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import { SelectionPopoverProvider } from './contexts/SelectionPopoverContext';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/ToastContainer';
import AuthPage from './components/AuthPage';
import SuspenseLoader from './components/SuspenseLoader';
import GamificationHeader from './components/GamificationHeader';
import HeaderStats from './components/HeaderStats';
import type { Feature, AppFeatureProps, AppSettings, LearningLevel, UserProfile } from './types';
import { 
    AppLogo, DictionaryIcon, TranslateIcon, VocabIcon, SRSIcon, 
    ConversationIcon, PronunciationIcon, HandwritingIcon, QuizIcon, AcademicCapIcon,
    SettingsIcon, UpgradeIcon, MediaIcon, CameraIcon, UserIcon, PlanIcon,
    MicIcon, ListBulletIcon, BrainCircuitIcon, SparklesIcon, HanjaIcon, DocumentTextIcon,
    BookOpenIcon, MenuIcon, ShieldCheckIcon, PlusCircleIcon, TrophyIcon, HistoryIcon, SearchIcon
} from './components/icons/Icons';
import { useAdmin } from './contexts/AdminContext';
import { apiClient } from './services/apiClient';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load feature components
const PersonalizedPlan = lazy(() => import('./components/PersonalizedPlan'));
const Translator = lazy(() => import('./components/Translator'));
const Dictionary = lazy(() => import('./components/Dictionary'));
const TopikVocab = lazy(() => import('./components/TopikVocab'));
const SpacedRepetition = lazy(() => import('./components/SpacedRepetition'));
const Conversations = lazy(() => import('./components/Conversations'));
const PronunciationPractice = lazy(() => import('./components/PronunciationPractice'));
const HandwritingPractice = lazy(() => import('./components/HandwritingPractice'));
const LearningJournal = lazy(() => import('./components/LearningJournal'));
const Quiz = lazy(() => import('./components/Quiz'));
const GrammarQuiz = lazy(() => import('./components/GrammarQuiz'));
const Settings = lazy(() => import('./components/Settings'));
const UpgradePage = lazy(() => import('./components/UpgradePage'));
const MediaLearning = lazy(() => import('./components/MediaLearning'));
const ImageRecognition = lazy(() => import('./components/ImageRecognition'));
const AiRolePlay = lazy(() => import('./components/AiRolePlay'));
const LiveTutor = lazy(() => import('./components/LiveTutor'));
const Profile = lazy(() => import('./components/Profile'));
const CommonPhrases = lazy(() => import('./components/CommonPhrases'));
const LandingPage = lazy(() => import('./components/LandingPage'));
const GrammarCurriculum = lazy(() => import('./components/GrammarReference'));
const GrammarHelper = lazy(() => import('./components/GrammarHelper'));
const HanjaExplorer = lazy(() => import('./components/HanjaExplorer'));
const StoryTime = lazy(() => import('./components/StoryTime'));
const AddCustomWord = lazy(() => import('./components/AddCustomWord'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const OnboardingModal = lazy(() => import('./components/OnboardingModal'));
const Competition = lazy(() => import('./components/Competition'));
const LearningHistory = lazy(() => import('./components/LearningHistory'));
const PlacementTest = lazy(() => import('./components/PlacementTest'));


const features: { id: Feature, name: string, Icon: React.FC<any>, component: React.LazyExoticComponent<React.FC<any>> }[] = [
    { id: 'plan', name: 'Bảng điều khiển', Icon: PlanIcon, component: PersonalizedPlan },
    { id: 'history', name: 'Lịch sử học tập', Icon: HistoryIcon, component: LearningHistory },
    { id: 'srs', name: 'Ôn tập (SRS)', Icon: SRSIcon, component: SpacedRepetition },
    { id: 'competition', name: 'Đấu Trường', Icon: TrophyIcon, component: Competition },
    { id: 'add_word', name: 'Thêm từ tùy chỉnh', Icon: PlusCircleIcon, component: AddCustomWord },
    { id: 'dictionary', name: 'Từ điển AI', Icon: DictionaryIcon, component: Dictionary },
    { id: 'translator', name: 'Dịch thuật', Icon: TranslateIcon, component: Translator },
    { id: 'vocab', name: 'Từ vựng TOPIK', Icon: VocabIcon, component: TopikVocab },
    { id: 'hanja', name: 'Khám phá Hanja', Icon: HanjaIcon, component: HanjaExplorer },
    { id: 'grammarCurriculum', name: 'Lộ trình Ngữ pháp', Icon: AcademicCapIcon, component: GrammarCurriculum },
    { id: 'grammarHelper', name: 'Hỏi Ngữ pháp AI', Icon: SparklesIcon, component: GrammarHelper },
    { id: 'conversations', name: 'Hội thoại', Icon: ConversationIcon, component: Conversations },
    { id: 'phrases', name: 'Cụm từ thông dụng', Icon: ListBulletIcon, component: CommonPhrases },
    { id: 'storytime', name: 'Kể chuyện AI', Icon: BookOpenIcon, component: StoryTime },
    { id: 'roleplay', name: 'Nhập vai AI', Icon: UserIcon, component: AiRolePlay },
    { id: 'livetutor', name: 'Gia sư AI Live', Icon: MicIcon, component: LiveTutor },
    { id: 'pronunciation', name: 'Luyện phát âm', Icon: PronunciationIcon, component: PronunciationPractice },
    { id: 'media', name: 'Học qua Media', Icon: MediaIcon, component: MediaLearning },
    { id: 'handwriting', name: 'Luyện viết tay', Icon: HandwritingIcon, component: HandwritingPractice },
    { id: 'journal', name: 'Nhật ký Học tập', Icon: DocumentTextIcon, component: LearningJournal },
    { id: 'quiz', name: 'Trắc nghiệm TOPIK', Icon: QuizIcon, component: Quiz },
    { id: 'grammarQuiz', name: 'Trắc nghiệm Ngữ pháp', Icon: BrainCircuitIcon, component: GrammarQuiz },
    { id: 'camera', name: 'Đây là gì?', Icon: CameraIcon, component: ImageRecognition },
];

const MobileHeader: React.FC<{ onMenuClick: () => void, featureName: string, onSearch: (query: string) => void }> = ({ onMenuClick, featureName, onSearch }) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isSearchOpen) {
            inputRef.current?.focus();
        }
    }, [isSearchOpen]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query);
        setQuery('');
        setIsSearchOpen(false);
    };

    return (
        <header className="md:hidden sticky top-0 z-20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-2 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2 h-16">
            {isSearchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex-grow flex items-center gap-2 animate-fade-in">
                    <div className="relative flex-grow">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            ref={inputRef}
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Tìm kiếm..."
                            className="w-full bg-slate-100 dark:bg-slate-700 rounded-lg p-2 pl-10"
                        />
                    </div>
                    <button type="button" onClick={() => setIsSearchOpen(false)} className="text-sm font-semibold text-hanguk-blue-600 dark:text-hanguk-blue-400 px-2">
                        Hủy
                    </button>
                </form>
            ) : (
                <>
                    <button onClick={onMenuClick} className="p-2 text-slate-600 dark:text-slate-300" aria-label="Mở menu">
                        <MenuIcon />
                    </button>
                    <h2 className="font-bold text-lg truncate flex-grow">{featureName}</h2>
                    <div className="flex items-center shrink-0 gap-2">
                        <HeaderStats />
                        <button onClick={() => setIsSearchOpen(true)} className="p-2 text-slate-600 dark:text-slate-300" aria-label="Tìm kiếm">
                            <SearchIcon />
                        </button>
                    </div>
                </>
            )}
        </header>
    );
};

const DesktopHeader: React.FC<{ onMenuClick: () => void, featureName: string, showMenuButton: boolean, onSearch: (query: string) => void }> = ({ onMenuClick, featureName, showMenuButton, onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query);
        setQuery('');
    };

    return (
        <header className="hidden md:flex sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-4 border-b border-slate-200 dark:border-slate-700 items-center gap-4 h-16">
            {showMenuButton && (
                <button onClick={onMenuClick} className="p-2 text-slate-600 dark:text-slate-300" aria-label="Mở menu">
                    <MenuIcon />
                </button>
            )}
            <h2 className="font-bold text-xl truncate">{featureName}</h2>
            <div className="ml-auto flex items-center gap-4">
                <HeaderStats />
                <form onSubmit={handleSearchSubmit} className="w-full max-w-xs relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Tìm kiếm từ vựng, ngữ pháp..."
                        className="w-full bg-slate-100 dark:bg-slate-700 rounded-lg p-2 pl-10 transition-all duration-300 focus:w-full focus:ring-2 focus:ring-hanguk-blue-500"
                    />
                </form>
            </div>
        </header>
    );
};

const grammarKeywords = ['là gì', 'cách dùng', 'khác biệt', 'khi nào', 'tại sao', 'ngữ pháp'];

const MainApp: React.FC = () => {
    const { currentUser, loading } = useAuth();
    const { isAdminVip } = useAdmin();
    const [activeFeature, setActiveFeature] = useState<Feature | 'landing'>('landing');
    const [featurePayload, setFeaturePayload] = useState<any>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isProfileLoading, setIsProfileLoading] = useState(true);

    const [settings, setSettings] = useState<AppSettings>({
        theme: 'system',
        sidebarMode: 'pinned',
        fontSize: 'base'
    });
    const [settingsLoaded, setSettingsLoaded] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            if (currentUser?.email) {
                setIsProfileLoading(true);
                try {
                    const profileData = await apiClient.get<UserProfile>('/api/data/user-profile');
                    if (profileData && typeof profileData.level !== 'undefined') {
                        setUserProfile(profileData);
                    } else {
                        const defaultProfile = { level: 'beginner' as LearningLevel };
                        setUserProfile(defaultProfile);
                        await apiClient.post('/api/data/user-profile', defaultProfile);
                    }
                } catch (e) {
                    const defaultProfile = { level: 'beginner' as LearningLevel };
                    setUserProfile(defaultProfile);
                    await apiClient.post('/api/data/user-profile', defaultProfile);
                } finally {
                    setIsProfileLoading(false);
                }
            } else {
                setUserProfile(null);
                setIsProfileLoading(false);
            }
        };
        loadProfile();
    }, [currentUser]);

    useEffect(() => {
        const loadSettings = async () => {
            if (currentUser?.email) {
                const savedSettings = await apiClient.get<Partial<AppSettings>>('/api/data/user-settings');
                setSettings(s => ({ ...s, ...savedSettings }));
            }
            setSettingsLoaded(true);
        };
        loadSettings();
    }, [currentUser]);

    useEffect(() => {
        if (!settingsLoaded) return;

        const root = window.document.documentElement;
        
        const isDark =
          settings.theme === 'dark' ||
          (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        root.classList.toggle('dark', isDark);

        let baseFontSize;
        switch(settings.fontSize) {
            case 'sm': baseFontSize = '14px'; break;
            case 'lg': baseFontSize = '18px'; break;
            default: baseFontSize = '16px'; break;
        }
        root.style.fontSize = baseFontSize;

        if (currentUser?.email) {
            apiClient.post('/api/data/user-settings', settings);
        }
    }, [settings, currentUser, settingsLoaded]);


    useEffect(() => {
        if (!loading && currentUser && userProfile?.level !== null && activeFeature === 'landing') {
            setActiveFeature('plan');
        }
    }, [currentUser, loading, activeFeature, userProfile]);

    useEffect(() => {
        const checkOnboarding = async () => {
             if (currentUser?.email && activeFeature === 'plan') {
                const hasSeenOnboarding = await apiClient.get<boolean>('/api/data/onboarding');
                if (!hasSeenOnboarding) {
                    setShowOnboarding(true);
                }
            }
        }
       checkOnboarding();
    }, [currentUser, activeFeature]);

    const handleCloseOnboarding = useCallback(async () => {
        if (!currentUser?.email) return;
        setShowOnboarding(false);
        await apiClient.post('/api/data/onboarding', true);
    }, [currentUser]);
    
    const handlePlacementTestComplete = useCallback(async (level: LearningLevel) => {
        const newProfile = { level };
        setUserProfile(newProfile);
        await apiClient.post('/api/data/user-profile', newProfile);
        setActiveFeature('plan');
    }, []);

    const handleSetActiveFeature = useCallback((feature: Feature, payload: any = null) => {
        setActiveFeature(feature);
        setFeaturePayload(payload);
        setIsSidebarOpen(false);
    }, []);
    
    const handleGlobalSearch = useCallback((query: string) => {
        if (!query.trim()) return;
        const lowerQuery = query.toLowerCase();

        if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(query)) {
            handleSetActiveFeature('dictionary', { word: query.trim() });
            return;
        }

        if (grammarKeywords.some(keyword => lowerQuery.includes(keyword))) {
            handleSetActiveFeature('grammarHelper', { query: query.trim() });
            return;
        }
        
        handleSetActiveFeature('dictionary', { word: query.trim() });
    }, [handleSetActiveFeature]);

    const handleLoginSuccess = useCallback(() => {
        // This is called from AuthPage. The useEffects that watch `currentUser` will handle the logic.
    }, []);

    const handleGetStarted = useCallback(() => {
        setActiveFeature('plan');
    }, []);
    
    if (loading || !settingsLoaded || isProfileLoading) {
        return <div className="w-screen h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900"><SuspenseLoader /></div>;
    }

    if (currentUser && !isProfileLoading && userProfile?.level === null) {
        return (
            <Suspense fallback={<div className="w-screen h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900"><SuspenseLoader /></div>}>
                <PlacementTest onComplete={handlePlacementTestComplete} />
            </Suspense>
        );
    }

    if (activeFeature === 'landing' && !currentUser) {
       return (
         <Suspense fallback={<div className="w-screen h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900"><SuspenseLoader /></div>}>
             <LandingPage onGetStartedClick={handleGetStarted} />
         </Suspense>
       );
    }

    if (!currentUser) {
        return <AuthPage onSuccess={handleLoginSuccess} />;
    }
    
    const ActiveComponent = features.find(f => f.id === activeFeature)?.component 
        || (activeFeature === 'settings' ? Settings 
        : activeFeature === 'upgrade' ? UpgradePage
        : activeFeature === 'profile' ? Profile
        : activeFeature === 'admin' ? AdminPanel
        : PersonalizedPlan) as React.LazyExoticComponent<React.FC<AppFeatureProps>>;
    
    const featureMap: Record<string, string> = {
        ...Object.fromEntries(features.map(f => [f.id, f.name])),
        'settings': 'Cài đặt',
        'upgrade': 'Nâng cấp VIP',
        'profile': 'Hồ sơ & Huy hiệu',
        'admin': 'Bảng điều khiển Admin'
    };
    const activeFeatureName = featureMap[activeFeature] || 'Học Tiếng Hàn';

    const isSidebarPinned = settings.sidebarMode === 'pinned';

    return (
        <div className="relative min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
            <div 
                className={`fixed inset-0 bg-black z-30 transition-opacity duration-300 ease-in-out ${isSidebarPinned ? 'md:hidden' : ''} ${isSidebarOpen ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'}`}
                onClick={() => setIsSidebarOpen(false)}
                aria-hidden={!isSidebarOpen}
            />

            <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-800 flex flex-col p-4 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${isSidebarPinned ? 'md:translate-x-0' : ''}`}>
                <div className="flex items-center gap-2 mb-6">
                    <AppLogo className="w-10 h-10" />
                    <h1 className="font-bold text-xl">Học Tiếng Hàn</h1>
                </div>
                
                <GamificationHeader />
                
                <nav className="flex-grow overflow-y-auto mt-4 pr-1">
                    <ul>
                        {features.map(({ id, name, Icon }) => (
                            <li key={id}>
                                <button
                                    onClick={() => handleSetActiveFeature(id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeFeature === id ? 'bg-hanguk-blue-100 dark:bg-hanguk-blue-900 text-hanguk-blue-700 dark:text-hanguk-blue-300' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                >
                                    <Icon /> {name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="mt-auto">
                    <div className="p-3 bg-slate-100 dark:bg-slate-900/50 rounded-lg mb-4 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold truncate">{currentUser.email}</span>
                            {(currentUser.isVip || isAdminVip) && (
                                <span className="ml-2 text-xs font-bold bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full">VIP</span>
                            )}
                        </div>
                    </div>
                     <button
                        onClick={() => handleSetActiveFeature('profile')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeFeature === 'profile' ? 'bg-slate-200 dark:bg-slate-700' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                    >
                        <UserIcon /> Hồ sơ & Huy hiệu
                    </button>
                    <button
                        onClick={() => handleSetActiveFeature('settings')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeFeature === 'settings' ? 'bg-slate-200 dark:bg-slate-700' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                    >
                        <SettingsIcon /> Cài đặt
                    </button>
                    {currentUser.isAdmin && (
                         <button
                            onClick={() => handleSetActiveFeature('admin')}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeFeature === 'admin' ? 'bg-slate-200 dark:bg-slate-700' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                        >
                            <ShieldCheckIcon /> Admin Panel
                        </button>
                    )}
                    {!(currentUser.isVip || isAdminVip) && (
                        <button
                            onClick={() => handleSetActiveFeature('upgrade')}
                            className="w-full flex items-center gap-3 px-3 py-2.5 mt-2 rounded-lg text-sm font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-md hover:opacity-90 transition-opacity"
                        >
                            <UpgradeIcon /> Nâng cấp VIP
                        </button>
                    )}
                </div>
            </aside>

            <div className={`${isSidebarPinned ? 'md:ml-64' : ''} flex flex-col transition-[margin] duration-300 ease-in-out`}>
                <DesktopHeader onMenuClick={() => setIsSidebarOpen(true)} featureName={activeFeatureName} showMenuButton={!isSidebarPinned} onSearch={handleGlobalSearch} />
                <MobileHeader onMenuClick={() => setIsSidebarOpen(true)} featureName={activeFeatureName} onSearch={handleGlobalSearch} />
                <main className="flex-1 p-4 md:p-8 md:overflow-y-auto">
                    <Suspense fallback={<SuspenseLoader />}>
                        <ActiveComponent 
                            setActiveFeature={handleSetActiveFeature} 
                            payload={featurePayload}
                            settings={settings}
                            setSettings={setSettings}
                        />
                    </Suspense>
                </main>
            </div>
            {showOnboarding && (
                <Suspense fallback={null}>
                    <OnboardingModal onClose={handleCloseOnboarding} />
                </Suspense>
            )}
        </div>
    );
};

const App: React.FC = () => {
    return (
        <ErrorBoundary>
            <AdminProvider>
                <ToastProvider>
                    <AuthProvider>
                        <SelectionPopoverProvider>
                            <MainApp />
                        </SelectionPopoverProvider>
                    </AuthProvider>
                    <ToastContainer />
                </ToastProvider>
            </AdminProvider>
        </ErrorBoundary>
    );
}

export default App;
