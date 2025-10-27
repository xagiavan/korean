const API_SETTINGS_KEY = 'koreanAppApiSettings';

export type Provider = 'gemini' | 'openai' | 'grok';

export interface ProviderSettings {
    keys: string[];
    model: string;
    lastUsedIndex: number;
}

export interface ApiSettings {
    activeProvider: Provider;
    providers: {
        gemini: ProviderSettings;
        openai: ProviderSettings;
        grok: ProviderSettings;
    };
}

export const defaultSettings: ApiSettings = {
    activeProvider: 'gemini',
    providers: {
        gemini: { keys: [], model: 'gemini-2.5-flash', lastUsedIndex: 0 },
        openai: { keys: [], model: 'gpt-4o', lastUsedIndex: 0 },
        grok: { keys: [], model: 'llama3-70b-8192', lastUsedIndex: 0 },
    }
};


export const getApiSettings = (): ApiSettings => {
    try {
        const stored = localStorage.getItem(API_SETTINGS_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Basic validation and merge with defaults to handle schema changes and new providers
            const mergedProviders = {
                gemini: { ...defaultSettings.providers.gemini, ...parsed.providers?.gemini },
                openai: { ...defaultSettings.providers.openai, ...parsed.providers?.openai },
                grok: { ...defaultSettings.providers.grok, ...parsed.providers?.grok },
            };
            return {
                ...defaultSettings,
                ...parsed,
                providers: mergedProviders
            };
        }
        return defaultSettings;
    } catch (e) {
        console.error("Could not read API settings from local storage.", e);
        return defaultSettings;
    }
};

export const saveApiSettings = (settings: ApiSettings): void => {
    try {
        // Create a deep copy to avoid mutating the original object from the component's state
        const settingsToSave = JSON.parse(JSON.stringify(settings));

        // Reset indexes when saving, so we start fresh with the new keys
        settingsToSave.providers.gemini.lastUsedIndex = 0;
        settingsToSave.providers.openai.lastUsedIndex = 0;
        settingsToSave.providers.grok.lastUsedIndex = 0;
        
        localStorage.setItem(API_SETTINGS_KEY, JSON.stringify(settingsToSave));
    } catch (e) {
        console.error("Could not save API settings to local storage.", e);
    }
};

export interface ApiClientConfig {
    provider: Provider;
    apiKey: string;
    model: string;
}

export const getNextApiClientConfig = (): ApiClientConfig | null => {
    try {
        const settings = getApiSettings();
        const providerName = settings.activeProvider;
        const providerSettings = settings.providers[providerName];

        if (!providerSettings) {
            return null;
        }
        
        // Defensively handle `keys` to ensure it's always an array.
        // This makes the function more robust against data inconsistency, such as being stored as a string.
        let keysArray: string[] = [];
        if (Array.isArray(providerSettings.keys)) {
            keysArray = providerSettings.keys;
        } else if (typeof providerSettings.keys === 'string') {
            // This is a type cast to 'any' because TypeScript knows 'keys' should be string[].
            // We are handling the case where it might be incorrect.
            keysArray = (providerSettings.keys as any).split(',').map((k: string) => k.trim()).filter(Boolean);
        }

        if (keysArray.length === 0) {
            return null;
        }

        const { model } = providerSettings;
        let { lastUsedIndex } = providerSettings;
        
        if (isNaN(lastUsedIndex) || lastUsedIndex >= keysArray.length) {
            lastUsedIndex = 0;
        }
        
        const apiKey = keysArray[lastUsedIndex];
        const nextIndex = (lastUsedIndex + 1) % keysArray.length;
        
        // Update the index for the next call
        settings.providers[providerName].lastUsedIndex = nextIndex;
        // This is a read-then-write operation, which is fine for localStorage.
        localStorage.setItem(API_SETTINGS_KEY, JSON.stringify(settings));

        return {
            provider: providerName,
            apiKey,
            model
        };
    } catch (e) {
        console.error("Could not get next API client config.", e);
        return null;
    }
};

export const getActiveKeyCount = (): number => {
    const settings = getApiSettings();
    const providerName = settings.activeProvider;
    if (providerName !== 'gemini') return 0;
    const providerSettings = settings.providers[providerName];
    return providerSettings?.keys?.length || 0;
};