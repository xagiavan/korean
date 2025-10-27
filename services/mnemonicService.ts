
import { apiClient } from './apiClient';

const API_ENDPOINT = '/api/data/mnemonics';
type MnemonicStore = Record<string, string>;

export const getMnemonics = async (): Promise<MnemonicStore> => {
    try {
        return await apiClient.get<MnemonicStore>(API_ENDPOINT);
    } catch (e) {
        console.error("Failed to get mnemonics:", e);
        return {};
    }
};

export const saveMnemonic = async (word: string, mnemonic: string): Promise<void> => {
    const allMnemonics = await getMnemonics();
    allMnemonics[word] = mnemonic;
    await apiClient.post(API_ENDPOINT, allMnemonics);
};

export const deleteUserMnemonics = (): Promise<void> => {
    return apiClient.delete(API_ENDPOINT);
};
