
import type { ErrorStats } from '../types';
import { apiClient } from './apiClient';

const API_ENDPOINT = '/api/data/error-stats';

const getDefaultStats = (): ErrorStats => ({
    grammar: {},
    vocab: {},
});

export const getErrorStats = async (): Promise<ErrorStats> => {
    try {
        return await apiClient.get<ErrorStats>(API_ENDPOINT);
    } catch (e) {
        console.error("Failed to get error stats:", e);
        return getDefaultStats();
    }
};

const saveErrorStats = async (stats: ErrorStats) => {
    await apiClient.post(API_ENDPOINT, stats);
};

export const addGrammarError = async (point: string) => {
    const stats = await getErrorStats();
    stats.grammar[point] = (stats.grammar[point] || 0) + 1;
    await saveErrorStats(stats);
};

export const addVocabError = async (word: string) => {
    const stats = await getErrorStats();
    stats.vocab[word] = (stats.vocab[word] || 0) + 1;
    await saveErrorStats(stats);
};

export const getCommonErrors = async (limit = 3): Promise<{ grammar: string[], vocab: string[] }> => {
    const stats = await getErrorStats();
    const sortedGrammar = Object.entries(stats.grammar).sort(([, a], [, b]) => b - a).map(([point]) => point);
    const sortedVocab = Object.entries(stats.vocab).sort(([, a], [, b]) => b - a).map(([word]) => word);
    return {
        grammar: sortedGrammar.slice(0, limit),
        vocab: sortedVocab.slice(0, limit),
    };
};

export const deleteUserErrorStats = (): Promise<void> => {
    return apiClient.delete(API_ENDPOINT);
};
