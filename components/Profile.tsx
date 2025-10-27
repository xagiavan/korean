import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as gamificationService from '../services/gamificationService';
import { getXpForLevel } from '../services/gamificationService';
import * as srsService from '../services/srsService';
import { apiClient } from '../services/apiClient';
import type { Badge, GamificationState, AppFeatureProps, LearningLevel } from '../types';
import FeatureHeader from './FeatureHeader';
import { LockClosedIcon, FireIcon, SRSIcon, TrophyIcon, DownloadIcon } from './icons/Icons';
import { useToast } from '../contexts/ToastContext';
import Loader from './Loader';

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; }> = ({ icon, label, value }) => (
    <div className="flex items-center gap-4 p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
        <div className="flex-shrink-0 text-hanguk-blue-600 dark:text-hanguk-blue-400">{icon}</div>
        <div>
            <div className="text-2xl font-bold text-slate-800 dark:text-white">{value}</div>
            <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</div>
        </div>
    </div>
);

const Profile: React.FC<AppFeatureProps> = ({ setActiveFeature }) => {
    const { currentUser, logout } = useAuth();
    const { addToast } = useToast();
    const [badges, setBadges] = useState<Badge[]>([]);
    const [gamificationState, setGamificationState] = useState<GamificationState | null>(null);
    const [srsDeckSize, setSrsDeckSize] = useState(0);
    const [profile, setProfile] = useState<{level: LearningLevel | null} | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        const loadProfileData = async () => {
            if (currentUser?.email) {
                setIsLoading(true);
                const [badgeData, gameState, deckSize, profileData] = await Promise.all([
                    gamificationService.getProfileDisplayBadges(),
                    gamificationService.getGamificationState(),
                    srsService.getDeckSize(),
                    apiClient.get<{level: LearningLevel | null}>('/api/data/user-profile')
                ]);
                setBadges(badgeData);
                setGamificationState(gameState);
                setSrsDeckSize(deckSize);
                setProfile(profileData);
                setIsLoading(false);
            }
        };
        loadProfileData();
    }, [currentUser]);

    const handleResetLevel = async () => {
        if (window.confirm('Bạn có chắc muốn làm lại bài kiểm tra trình độ? Lộ trình học của bạn sẽ được điều chỉnh theo kết quả mới.')) {
            await apiClient.post('/api/data/user-profile', { level: null });
            addToast({type: 'info', title: 'Đang tải lại...', message: 'Ứng dụng sẽ tải lại để bắt đầu bài kiểm tra.'});
            setTimeout(() => window.location.reload(), 1500);
        }
    };

    const handleDownloadSrs = async () => {
        if (!currentUser?.email) return;
        setIsDownloading(true);
        try {
            const deck = await srsService.getDeck();
            if (deck.length === 0) {
                addToast({type: 'info', title: 'Bộ ôn tập trống', message: 'Không có từ nào để tải xuống.'});
                return;
            }
            const headers = "word,romanization,partOfSpeech,meaning,example_sentence,example_translation,srsLevel,nextReview";
            const csvContent = [
                headers,
                ...deck.map(item => [
                    `"${item.word.replace(/"/g, '""')}"`,
                    `"${item.romanization.replace(/"/g, '""')}"`,
                    `"${item.meaning.replace(/"/g, '""')}"`,
                    `"${item.partOfSpeech.replace(/"/g, '""')}"`,
                    `"${item.example_sentence.replace(/"/g, '""')}"`,
                    `"${item.example_translation.replace(/"/g, '""')}"`,
                    item.srsLevel,
                    item.nextReview
                ].join(','))
            ].join('\n');
            
            const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "srs_deck.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            addToast({type: 'success', title: 'Đã tải xuống', message: 'Bộ ôn tập của bạn đã được xuất ra file CSV.'});
        } catch (error) {
            console.error("CSV download error:", error);
            addToast({type: 'error', title: 'Lỗi', message: 'Không thể tải xuống file CSV.'});
        } finally {
            setIsDownloading(false);
        }
    };

    const handleDeleteAccount = useCallback(async () => {
        if (!currentUser?.email) return;

        if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản và toàn bộ dữ liệu không? Hành động này KHÔNG THỂ hoàn tác.')) {
            try {
                // In a real app, this would be a single API call: await apiClient.delete('/api/users/me');
                // For mock, we delete data piece by piece.
                await Promise.all([
                    apiClient.delete('/api/gamification/state'),
                    apiClient.delete('/api/srs/deck'),
                    apiClient.delete('/api/history/dictionary'),
                    apiClient.delete('/api/history/translation'),
                    apiClient.delete('/api/history/learning'),
                    apiClient.delete('/api/data/error-stats'),
                    apiClient.delete('/api/data/stats'),
                    apiClient.delete('/api/data/playback'),
                    apiClient.delete('/api/data/mnemonics'),
                    apiClient.delete('/api/data/grammar-progress'),
                    apiClient.delete('/api/data/onboarding'),
                    apiClient.delete('/api/journal'),
                    apiClient.delete('/api/data/user-profile')
                ]);

                addToast({ type: 'success', title: 'Hoàn tất', message: 'Tài khoản và dữ liệu của bạn đã được xóa.' });
                await logout();

            } catch (error) {
                console.error("Failed to delete all user data:", error);
                addToast({ type: 'error', title: 'Lỗi', message: 'Không thể xóa dữ liệu của bạn.' });
            }
        }
    }, [currentUser, logout, addToast]);


    if (isLoading) {
        return <div className="min-h-[50vh] flex items-center justify-center"><Loader /></div>;
    }

    if (!currentUser || !gamificationState) {
        return <div>Vui lòng đăng nhập để xem hồ sơ.</div>;
    }

    const { xp, level, streak, unlockedBadgeIds } = gamificationState;
    const xpForNextLevel = getXpForLevel(level + 1);
    const xpForCurrentLevel = getXpForLevel(level);
    const levelProgress = xpForNextLevel > xpForCurrentLevel ? ((xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100 : 100;
    
    const levelMap: Record<LearningLevel, string> = {
        beginner: 'Sơ cấp',
        intermediate: 'Trung cấp',
        advanced: 'Cao cấp'
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <FeatureHeader
                title="Hồ sơ của bạn"
                description="Theo dõi tiến độ học tập, thành tích và quản lý tài khoản."
            />
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Thông tin tài khoản</h3>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-2xl font-bold">{currentUser.email}</p>
                        <p className={`font-semibold ${currentUser.isVip ? 'text-yellow-500' : 'text-slate-500'}`}>{currentUser.isVip ? "Tài khoản VIP" : "Tài khoản Miễn phí"}</p>
                    </div>
                    <button onClick={logout} className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600">
                        Đăng xuất
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Trình độ học tập</h3>
                <div className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                    <div>
                        <p className="font-semibold text-slate-700 dark:text-slate-200">Trình độ hiện tại của bạn</p>
                        <p className="text-2xl font-bold text-hanguk-blue-600 dark:text-hanguk-blue-400">
                            {profile?.level ? levelMap[profile.level] : 'Chưa xác định'}
                        </p>
                    </div>
                    <button onClick={handleResetLevel} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700">
                        Làm lại bài kiểm tra
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                 <h3 className="text-xl font-bold mb-4">Tiến độ học tập</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-6">
                    <div>
                        <div className="flex justify-between items-baseline mb-1">
                            <span className="font-bold text-lg">Cấp {level}</span>
                             <span className="text-sm text-slate-500 dark:text-slate-400">{xp} / {xpForNextLevel} XP</span>
                        </div>
                         <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4">
                            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-4 rounded-full" style={{ width: `${levelProgress > 0 ? levelProgress : 0}%` }}></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center p-4 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                        <FireIcon className="w-10 h-10 text-orange-500" />
                        <div className="ml-4">
                            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{streak}</p>
                            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Ngày học liên tiếp</p>
                        </div>
                    </div>
                 </div>
                 <h4 className="font-semibold text-md mb-3">Thống kê của tôi</h4>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <StatCard icon={<SRSIcon className="w-8 h-8"/>} label="Từ vựng trong bộ ôn tập" value={srsDeckSize} />
                    <StatCard icon={<TrophyIcon className="w-8 h-8"/>} label="Huy hiệu đã mở khóa" value={`${unlockedBadgeIds.length} / ${gamificationService.allBadges.length}`} />
                 </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Quản lý Dữ liệu</h3>
                <div className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                    <div>
                        <p className="font-semibold text-slate-700 dark:text-slate-200">Xuất dữ liệu ôn tập (SRS)</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Tải xuống toàn bộ bộ từ vựng của bạn dưới dạng file CSV.</p>
                    </div>
                    <button onClick={handleDownloadSrs} disabled={isDownloading} className="flex items-center gap-2 px-4 py-2 bg-hanguk-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-hanguk-blue-700 disabled:opacity-50">
                        <DownloadIcon /> {isDownloading ? 'Đang xuất...' : 'Tải xuống'}
                    </button>
                </div>
            </div>
            
             <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Huy hiệu đã mở khóa</h3>
                {unlockedBadgeIds.length > 0 ? (
                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {badges.map(badge => (
                           <div key={badge.id} className={`p-4 rounded-lg text-center flex flex-col items-center justify-start transition-opacity ${!badge.isUnlocked ? 'bg-slate-100 dark:bg-slate-900 opacity-60' : ''}`}>
                                <div className={`relative w-20 h-20 flex items-center justify-center rounded-full ${badge.isUnlocked ? 'bg-yellow-400' : 'bg-slate-300 dark:bg-slate-700'}`}>
                                    <badge.icon className="w-10 h-10 text-white" />
                                    {!badge.isUnlocked && <LockClosedIcon className="absolute w-6 h-6 text-slate-500 dark:text-slate-400" />}
                                </div>
                                <p className="font-bold text-sm mt-2">{badge.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{badge.description}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg flex flex-col items-center">
                        <div className="p-4 bg-yellow-100 dark:bg-yellow-900/50 rounded-full mb-4">
                            <TrophyIcon className="w-10 h-10 text-yellow-500" />
                        </div>
                        <p className="font-semibold text-slate-600 dark:text-slate-300">Bạn chưa mở khóa huy hiệu nào.</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Hoàn thành nhiệm vụ tuần và các hoạt động học tập để sưu tầm nhé!</p>
                        <button onClick={() => setActiveFeature('competition')} className="mt-6 flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 font-semibold rounded-lg text-sm hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors">
                            Xem nhiệm vụ tuần
                        </button>
                    </div>
                )}
            </div>
            
            <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-lg shadow-md border border-red-200 dark:border-red-800">
                <h3 className="text-xl font-bold text-red-700 dark:text-red-300">Khu vực nguy hiểm</h3>
                <p className="text-sm text-red-600 dark:text-red-400 mt-2 mb-4">
                    Hành động dưới đây không thể hoàn tác. Toàn bộ dữ liệu học tập của bạn, bao gồm bộ ôn tập, tiến độ, huy hiệu và lịch sử sẽ bị xóa vĩnh viễn.
                </p>
                <button 
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700"
                >
                    Xóa Tài khoản & Toàn bộ Dữ liệu
                </button>
            </div>
        </div>
    );
};

export default Profile;