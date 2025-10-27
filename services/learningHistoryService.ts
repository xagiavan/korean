
import type { LearningHistoryItem, VocabItem, Phrase, GrammarPoint } from '../types';
import { apiClient } from './apiClient';

const API_ENDPOINT = '/api/history/learning';
const MAX_HISTORY_SIZE = 50;

export const getHistory = async (): Promise<LearningHistoryItem[]> => {
    try {
        return await apiClient.get<LearningHistoryItem[]>(API_ENDPOINT);
    } catch (e) {
        console.error("Failed to get learning history:", e);
        return [];
    }
};

export const addHistoryItem = async (
    type: 'vocab' | 'phrase' | 'grammar',
    content: VocabItem | Phrase | GrammarPoint
): Promise<void> => {
    let history = await getHistory();

    const newItem: LearningHistoryItem = {
        id: new Date().toISOString(),
        type,
        content,
    };

    if (history.length > 0) {
        const lastItem = history[0];
        const lastContent = lastItem.content;
        let isDuplicate = false;
        if (lastItem.type === 'vocab' && newItem.type === 'vocab') {
            isDuplicate = (lastContent as VocabItem).word === (newItem.content as VocabItem).word;
        } else if (lastItem.type === 'phrase' && newItem.type === 'phrase') {
            isDuplicate = (lastContent as Phrase).korean === (newItem.content as Phrase).korean;
        } else if (lastItem.type === 'grammar' && newItem.type === 'grammar') {
            isDuplicate = (lastContent as GrammarPoint).pattern === (newItem.content as GrammarPoint).pattern;
        }
        if (isDuplicate) return;
    }

    history.unshift(newItem);

    if (history.length > MAX_HISTORY_SIZE) {
        history = history.slice(0, MAX_HISTORY_SIZE);
    }

    await apiClient.post(API_ENDPOINT, history);
};

export const deleteUserHistory = (): Promise<void> => {
    return apiClient.delete(API_ENDPOINT);
};
