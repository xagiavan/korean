import type { TranslationHistoryItem } from '../types';
import { apiClient } from './apiClient';

const API_ENDPOINT = '/api/history/translation';
const MAX_HISTORY_SIZE = 5;

export const getHistory = async (): Promise<TranslationHistoryItem[]> => {
    try {
        return await apiClient.get<TranslationHistoryItem[]>(API_ENDPOINT);
    } catch (e) {
        console.error("Failed to get translation history:", e);
        return [];
    }
};

export const addHistoryItem = async (item: Omit<TranslationHistoryItem, 'id'>): Promise<void> => {
    let history = await getHistory();
    const newItem: TranslationHistoryItem = { ...item, id: Date.now().toString() };
    history = history.filter(h => !(h.inputText === newItem.inputText && h.fromLang === newItem.fromLang));
    history.unshift(newItem);
    if (history.length > MAX_HISTORY_SIZE) {
        history = history.slice(0, MAX_HISTORY_SIZE);
    }
    await apiClient.post(API_ENDPOINT, history);
};

export const deleteHistoryItem = async (id: string): Promise<void> => {
    let history = await getHistory();
    history = history.filter(item => item.id !== id);
    await apiClient.post(API_ENDPOINT, history);
};

export const deleteUserHistory = (): Promise<void> => {
    return apiClient.delete(API_ENDPOINT);
};
