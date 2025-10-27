
import type { VocabItem } from '../types';
import { apiClient } from './apiClient';

const API_ENDPOINT = '/api/srs/deck';
const SRS_INTERVALS = [0, 1, 2, 4, 8, 16, 32, 64, 128]; 

export const getDeck = async (): Promise<VocabItem[]> => {
    try {
        return await apiClient.get<VocabItem[]>(API_ENDPOINT);
    } catch (e) {
        console.error("Failed to get SRS deck:", e);
        return [];
    }
};

export const addWordsToDeck = async (newWords: VocabItem[]): Promise<number> => {
    const deck = await getDeck();
    const existingWords = new Set(deck.map(item => item.word));
    let addedCount = 0;
    
    newWords.forEach(word => {
        if (!existingWords.has(word.word)) {
            const newItem: VocabItem = {
                ...word,
                srsLevel: 0,
                nextReview: new Date().toISOString(),
                lastReviewed: new Date().toISOString(),
            };
            deck.push(newItem);
            addedCount++;
        }
    });

    if (addedCount > 0) {
        await apiClient.post(API_ENDPOINT, deck);
    }
    return addedCount;
};

export const getReviewQueue = async (limit?: number): Promise<VocabItem[]> => {
    const deck = await getDeck();
    const now = new Date();
    const dueCards = deck
        .filter(item => new Date(item.nextReview || 0) <= now)
        .sort((a, b) => (a.srsLevel || 0) - (b.srsLevel || 0)); 
        
    if (limit) {
        return dueCards.slice(0, limit);
    }
    return dueCards;
};

export const updateItem = async (word: string, wasCorrect: boolean): Promise<void> => {
    const deck = await getDeck();
    const itemIndex = deck.findIndex(item => item.word === word);

    if (itemIndex === -1) return;

    const item = deck[itemIndex];
    let newSrsLevel = item.srsLevel || 0;

    if (wasCorrect) {
        newSrsLevel = Math.min(newSrsLevel + 1, SRS_INTERVALS.length - 1);
    } else {
        newSrsLevel = Math.max(0, Math.floor(newSrsLevel / 2));
    }

    const now = new Date();
    const nextReviewDate = new Date(now);
    nextReviewDate.setDate(now.getDate() + SRS_INTERVALS[newSrsLevel]);
    
    deck[itemIndex] = {
        ...item,
        srsLevel: newSrsLevel,
        nextReview: nextReviewDate.toISOString(),
        lastReviewed: now.toISOString(),
    };

    await apiClient.post(API_ENDPOINT, deck);
};

export const getDeckStats = async () => {
    const deck = await getDeck();
    const now = new Date();
    const reviewCount = deck.filter(item => new Date(item.nextReview || 0) <= now).length;
    const learningCount = deck.filter(item => (item.srsLevel || 0) > 0).length;

    return {
        total: deck.length,
        dueForReview: reviewCount,
        learning: learningCount,
    };
};

export const getDeckSize = async (): Promise<number> => {
    const deck = await getDeck();
    return deck.length;
};

export const deleteUserDeck = (): Promise<void> => {
    return apiClient.delete(API_ENDPOINT);
};
