import React from 'react';
import type { GamificationState, Badge, LeaderboardUser, WeeklyQuest } from '../types';
import * as srsService from './srsService';
import * as geminiService from './geminiService';
import { BookOpenIcon, CalendarDaysIcon, ChatBubbleIcon, DictionaryIcon, TargetIcon, FireIcon, AcademicCapIcon, ConversationIcon, AnalyzeIcon } from '../components/icons/Icons';
import { apiClient } from './apiClient';

export const GAMIFICATION_UPDATED_EVENT = 'gamificationUpdated';
const API_ENDPOINT = '/api/gamification/state';

export const allBadges: Badge[] = [
    // SRS Vocab Badges
    { id: 'srs-1', name: 'Người Sưu Tầm', description: 'Thêm 10 từ vào bộ ôn tập', icon: BookOpenIcon },
    { id: 'srs-2', name: 'Thư Viện Sống', description: 'Thêm 50 từ vào bộ ôn tập', icon: BookOpenIcon },
    { id: 'srs-3', name: 'Bậc Thầy Từ Vựng', description: 'Thêm 100 từ vào bộ ôn tập', icon: BookOpenIcon },
    // Streak Badges
    { id: 'streak-1', name: 'Khởi Đầu Tốt Đẹp', description: 'Duy trì chuỗi 3 ngày học', icon: CalendarDaysIcon },
    { id: 'streak-2', name: 'Người Học Bền Bỉ', description: 'Duy trì chuỗi 7 ngày học', icon: CalendarDaysIcon },
    { id: 'streak-3', name: 'Không Thể Cản Phá', description: 'Duy trì chuỗi 30 ngày học', icon: FireIcon },
    // Quiz Badges
    { id: 'quiz-1', name: 'Học sinh Xuất sắc', description: 'Đạt 90% trở lên trong bài trắc nghiệm', icon: TargetIcon },
    { id: 'quiz-complete-1', name: 'Bậc thầy Trắc nghiệm', description: 'Hoàn thành 5 bài trắc nghiệm', icon: AcademicCapIcon },
    // Role Play Badges
    { id: 'roleplay-1', name: 'Người Giao Tiếp', description: 'Hoàn thành 1 kịch bản nhập vai', icon: ChatBubbleIcon },
    { id: 'roleplay-2', name: 'Diễn Viên Chính', description: 'Hoàn thành 3 kịch bản nhập vai khác nhau', icon: ChatBubbleIcon },
    // Dictionary Badges
    { id: 'dict-1', name: 'Nhà Thám Hiểm', description: 'Tra cứu 25 từ khác nhau', icon: DictionaryIcon },
    // Conversation Creation Badges
    { id: 'convo-create-1', name: 'Nhà Sáng tạo Hội thoại', description: 'Tạo 10 hội thoại AI', icon: ConversationIcon },
    // Grammar Analysis Badges
    { id: 'grammar-guru-1', name: 'Chuyên gia Ngữ pháp', description: 'Phân tích 20 câu', icon: AnalyzeIcon },
];

const getInitialState = (): GamificationState => ({
    xp: 0,
    level: 1,
    streak: 0,
    lastActivityDate: '1970-01-01',
    unlockedBadgeIds: [],
    uniqueDictionaryLookups: [],
    completedRolePlays: [],
    completedQuizzesCount: 0,
    createdConversationsCount: 0,
    analyzedSentencesCount: 0,
    grammarQuizStats: {},
    completedQuestIds: [],
});

export const getXpForLevel = (level: number): number => {
    if (level <= 1) return 0;
    return Math.floor(100 * Math.pow(level - 1, 1.5));
};

export const getGamificationState = async (): Promise<GamificationState> => {
    try {
        const state = await apiClient.get<GamificationState>(API_ENDPOINT);
        
        const today = new Date().toISOString().slice(0, 10);
        if (state.lastActivityDate !== today) {
            const lastActivity = new Date(state.lastActivityDate);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastActivity.toISOString().slice(0, 10) !== yesterday.toISOString().slice(0, 10)) {
                state.streak = 0; // Reset streak if not consecutive days
            }
        }
        return state;
    } catch (e) {
        console.error("Failed to get gamification state", e);
        return getInitialState();
    }
};

const saveGamificationState = async (state: GamificationState): Promise<GamificationState> => {
    try {
        const updatedState = await apiClient.post<GamificationState, GamificationState>(API_ENDPOINT, state);
        window.dispatchEvent(new Event(GAMIFICATION_UPDATED_EVENT));
        return updatedState;
    } catch (e) {
        console.error("Failed to save gamification state", e);
        return state;
    }
};

const checkAllBadges = async (state: GamificationState): Promise<Badge[]> => {
    const newlyUnlocked: Badge[] = [];
    // Badge thresholds
    const badgeChecks = {
        'srs-1': (await srsService.getDeck()).length >= 10,
        'srs-2': (await srsService.getDeck()).length >= 50,
        'srs-3': (await srsService.getDeck()).length >= 100,
        'streak-1': state.streak >= 3,
        'streak-2': state.streak >= 7,
        'streak-3': state.streak >= 30,
        'roleplay-1': (state.completedRolePlays?.length || 0) >= 1,
        'roleplay-2': (state.completedRolePlays?.length || 0) >= 3,
        'dict-1': (state.uniqueDictionaryLookups?.length || 0) >= 25,
        'quiz-complete-1': (state.completedQuizzesCount || 0) >= 5,
        'convo-create-1': (state.createdConversationsCount || 0) >= 10,
        'grammar-guru-1': (state.analyzedSentencesCount || 0) >= 20,
    };

    for (const badge of allBadges) {
        // @ts-ignore
        if (!state.unlockedBadgeIds.includes(badge.id) && badgeChecks[badge.id]) {
            state.unlockedBadgeIds.push(badge.id);
            newlyUnlocked.push({ ...badge, isUnlocked: true });
        }
    }
    return newlyUnlocked;
};

export const addXp = async (amount: number): Promise<{ newBadges: Badge[] }> => {
    const state = await getGamificationState();
    state.xp += amount;
    
    let xpForNextLevel = getXpForLevel(state.level + 1);
    while (state.xp >= xpForNextLevel) {
        state.level += 1;
        xpForNextLevel = getXpForLevel(state.level + 1);
    }
    
    const today = new Date().toISOString().slice(0, 10);
    if (state.lastActivityDate !== today) {
        state.streak += 1; // Streak logic is simplified in getGamificationState, just increment on new day activity
        state.lastActivityDate = today;
    }
    
    const newBadges = await checkAllBadges(state);
    await saveGamificationState(state);
    return { newBadges };
};

export const recordDictionaryLookup = async (word: string): Promise<Badge[]> => {
    const state = await getGamificationState();
    const lowerCaseWord = word.toLowerCase();
    if (!state.uniqueDictionaryLookups) state.uniqueDictionaryLookups = [];
    if (!state.uniqueDictionaryLookups.includes(lowerCaseWord)) {
        state.uniqueDictionaryLookups.push(lowerCaseWord);
    }
    const newBadges = await checkAllBadges(state);
    await saveGamificationState(state);
    return newBadges;
};

// ... other record functions similarly refactored to be async ...
export const recordRolePlayCompletion = async (scenarioId: string): Promise<Badge[]> => {
    const state = await getGamificationState();
    if (!state.completedRolePlays) state.completedRolePlays = [];
    if (!state.completedRolePlays.includes(scenarioId)) {
        state.completedRolePlays.push(scenarioId);
    }
    const newBadges = await checkAllBadges(state);
    await saveGamificationState(state);
    return newBadges;
};

export const recordQuizCompletion = async (): Promise<Badge[]> => {
    const state = await getGamificationState();
    state.completedQuizzesCount = (state.completedQuizzesCount || 0) + 1;
    const newBadges = await checkAllBadges(state);
    await saveGamificationState(state);
    return newBadges;
};


// Other services will follow a similar async pattern
export const getProfileDisplayBadges = async (): Promise<Badge[]> => {
    const state = await getGamificationState();
    return allBadges.map(badgeDef => ({
        ...badgeDef,
        isUnlocked: state.unlockedBadgeIds.includes(badgeDef.id)
    }));
};

export const deleteUserState = (): Promise<void> => {
    return apiClient.delete(API_ENDPOINT);
};


// --- Functions to be refactored similarly ---
export const recordConversationCreation = async (): Promise<Badge[]> => {
    const state = await getGamificationState();
    state.createdConversationsCount = (state.createdConversationsCount || 0) + 1;
    const newBadges = await checkAllBadges(state);
    await saveGamificationState(state);
    return newBadges;
};

export const recordGrammarAnalysis = async (): Promise<Badge[]> => {
    const state = await getGamificationState();
    state.analyzedSentencesCount = (state.analyzedSentencesCount || 0) + 1;
    const newBadges = await checkAllBadges(state);
    await saveGamificationState(state);
    return newBadges;
};

export const getGrammarQuizSummary = async (): Promise<{ attemptedCount: number, totalTakenCount: number }> => {
    const state = await getGamificationState();
    const stats = state.grammarQuizStats || {};
    const attemptedCount = Object.keys(stats).length;
    const totalTakenCount = Object.values(stats).reduce((sum, count) => sum + count, 0);
    return { attemptedCount, totalTakenCount };
};

export const getAttemptedGrammarQuizIds = async (): Promise<string[]> => {
    const state = await getGamificationState();
    return Object.keys(state.grammarQuizStats || {});
};

export const recordGrammarQuizAttempt = async (categoryId: string) => {
    const state = await getGamificationState();
    if (!state.grammarQuizStats) {
        state.grammarQuizStats = {};
    }
    state.grammarQuizStats[categoryId] = (state.grammarQuizStats[categoryId] || 0) + 1;
    await saveGamificationState(state);
};

export const checkSrsBadges = async (): Promise<Badge[]> => {
    const state = await getGamificationState();
    const newBadges = await checkAllBadges(state);
    await saveGamificationState(state);
    return newBadges;
};

export const checkQuizBadges = async (scorePercent: number): Promise<Badge[]> => {
    const state = await getGamificationState();
    const newlyUnlocked: Badge[] = [];
    if (scorePercent >= 90 && !state.unlockedBadgeIds.includes('quiz-1')) {
        state.unlockedBadgeIds.push('quiz-1');
        const badgeDef = allBadges.find(b => b.id === 'quiz-1');
        if(badgeDef) newlyUnlocked.push({...badgeDef, isUnlocked: true});
    }

    if (newlyUnlocked.length > 0) {
        await saveGamificationState(state);
    }
    return newlyUnlocked;
};

export const recordQuestCompletion = async (questId: string) => {
    const state = await getGamificationState();
    if (!state.completedQuestIds) {
        state.completedQuestIds = [];
    }
    if (!state.completedQuestIds.includes(questId)) {
        state.completedQuestIds.push(questId);
        await saveGamificationState(state);
    }
};


// --- Competition / Leaderboard Functions (mocked) ---

export const getLeaderboardData = (currentUserEmail: string, currentUserXp: number): LeaderboardUser[] => {
    // This remains a mock as it's for display and not stored data.
    const mockNames = ["Minjun", "Seojun", "Doyoon", "Siwoo", "Joo-won", "Ye-jun", "Seo-yeon", "Ji-woo", "Seo-hyun", "Ha-yoon"];
    const users: Omit<LeaderboardUser, 'rank'>[] = [];
    const currentUserDisplayName = currentUserEmail.split('@')[0];
    users.push({ name: currentUserDisplayName, xp: currentUserXp, isCurrentUser: true });

    for (let i = 0; i < 29; i++) {
        const xp = Math.max(0, currentUserXp + Math.floor((Math.random() - 0.45) * 500));
        users.push({ name: mockNames[i % mockNames.length], xp, isCurrentUser: false });
    }

    return users.sort((a, b) => b.xp - a.xp).map((user, index) => ({ ...user, rank: index + 1 }));
};

export const generateWeeklyQuests = async (userEmail: string): Promise<{ quests: WeeklyQuest[], isSuccess: boolean, errorMessage?: string }> => {
    // This calls an external service, so it remains largely the same.
    const { getCommonErrors } = await import('./errorTrackingService');
    const commonErrors = await getCommonErrors(2);
    let errorContext = "Người dùng này không có lỗi nào được ghi nhận gần đây. Hãy tạo 3 nhiệm vụ chung, đa dạng.";
    if (commonErrors.grammar.length > 0 || commonErrors.vocab.length > 0) {
        errorContext = `Người dùng này thường mắc lỗi với các chủ đề sau: ${[...commonErrors.grammar, ...commonErrors.vocab].join(', ')}. Hãy ưu tiên tạo các nhiệm vụ giúp họ luyện tập những điểm yếu này.`;
    }
    return geminiService.generateWeeklyQuests(errorContext);
};
