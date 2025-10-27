
import type { VocabItem } from '../types';
import { apiClient } from './apiClient';

const API_ENDPOINT = '/api/history/dictionary';
const MAX_HISTORY_SIZE = 7;

export const getHistory = async (): Promise<VocabItem[]> => {
    try {
        return await apiClient.get<VocabItem[]>(API_ENDPOINT);
    } catch (e) {
        console.error("Failed to get dictionary history:", e);
        return [];
    }
};

export const addHistoryItem = async (item: VocabItem): Promise<void> => {
    let history = await getHistory();
    history = history.filter(h => h.word !== item.word);
    history.unshift(item);
    if (history.length > MAX_HISTORY_SIZE) {
        history = history.slice(0, MAX_HISTORY_SIZE);
    }
    await apiClient.post(API_ENDPOINT, history);
};

export const deleteUserHistory = (): Promise<void> => {
    return apiClient.delete(API_ENDPOINT);
};
