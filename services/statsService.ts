
import type { AppStats, DailyStats } from '../types';
import { apiClient } from './apiClient';

export const STATS_UPDATED_EVENT = 'appStatsUpdated';
const API_ENDPOINT = '/api/data/stats';

const getInitialStats = (): AppStats => ({
    today: { listened: 0, tested: 0 },
    thisMonth: { listened: 0, tested: 0 },
    lastUpdated: new Date().toISOString().slice(0, 10),
});

const saveStats = async (stats: AppStats) => {
    await apiClient.post(API_ENDPOINT, stats);
    window.dispatchEvent(new Event(STATS_UPDATED_EVENT));
};

export const getStats = async (): Promise<AppStats> => {
    try {
        const stats = await apiClient.get<AppStats>(API_ENDPOINT);
        const today = new Date();
        const lastUpdated = new Date(stats.lastUpdated);

        let needsUpdate = false;
        if (today.toDateString() !== lastUpdated.toDateString()) {
            stats.today = { listened: 0, tested: 0 };
            needsUpdate = true;
        }

        if (today.getFullYear() !== lastUpdated.getFullYear() || today.getMonth() !== lastUpdated.getMonth()) {
            stats.thisMonth = { listened: 0, tested: 0 };
            needsUpdate = true;
        }

        if (needsUpdate) {
            stats.lastUpdated = today.toISOString().slice(0, 10);
            // Don't save here, let the caller decide when to save.
        }
        
        return stats;
    } catch (e) {
        return getInitialStats();
    }
};

const incrementStat = async (statName: keyof DailyStats) => {
    const stats = await getStats(); 
    stats.today[statName] += 1;
    stats.thisMonth[statName] += 1;
    stats.lastUpdated = new Date().toISOString().slice(0, 10);
    await saveStats(stats);
};

export const incrementListenStat = async () => {
    await incrementStat('listened');
};

export const incrementTestStat = async () => {
    await incrementStat('tested');
};

export const deleteUserStats = (): Promise<void> => {
    return apiClient.delete(API_ENDPOINT);
};
