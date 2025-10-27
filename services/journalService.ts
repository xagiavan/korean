


import { apiClient } from './apiClient';
import type { JournalAnalysis } from '../types';
import { analyzeJournalEntry as analyzeWithGemini } from './geminiService';

type JournalStatus = 'none' | 'important' | 'review';

export interface JournalEntry {
    content: string;
    timestamp: string | null;
    status: JournalStatus;
}

export const loadJournalEntry = async (): Promise<JournalEntry> => {
    try {
        return await apiClient.get<JournalEntry>('/api/journal');
    } catch (e) {
        console.error("Failed to load journal entry:", e);
        return { content: '', timestamp: null, status: 'none' };
    }
};

export const saveJournalEntry = async (content: string, status: JournalStatus): Promise<JournalEntry> => {
    const timestamp = new Date().toISOString();
    const entry: Partial<JournalEntry> = { content, status, timestamp };
    return await apiClient.post<Partial<JournalEntry>, JournalEntry>('/api/journal', entry);
};

// This function remains a client-side call to Gemini for demo purposes.
// In a production app, this would be a backend endpoint that calls Gemini securely.
export const analyzeJournalEntryWithGemini = async (content: string): Promise<JournalAnalysis> => {
    return analyzeWithGemini(content);
};