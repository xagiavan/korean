
import { apiClient } from './apiClient';

const API_ENDPOINT = '/api/data/playback';
type PositionStore = Record<string, number>;

const getPositions = async (): Promise<PositionStore> => {
    try {
        return await apiClient.get<PositionStore>(API_ENDPOINT);
    } catch (e) {
        console.error("Failed to get playback positions:", e);
        return {};
    }
};

export const savePosition = async (mediaId: string, position: number): Promise<void> => {
    const positions = await getPositions();
    positions[mediaId] = position;
    await apiClient.post(API_ENDPOINT, positions);
};

export const getPosition = async (mediaId: string): Promise<number | null> => {
    const positions = await getPositions();
    return positions[mediaId] || null;
};

export const clearPosition = async (mediaId: string): Promise<void> => {
    const positions = await getPositions();
    delete positions[mediaId];
    await apiClient.post(API_ENDPOINT, positions);
};

export const deleteUserPositions = (): Promise<void> => {
    return apiClient.delete(API_ENDPOINT);
};
