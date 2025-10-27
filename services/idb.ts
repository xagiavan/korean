const DB_NAME = 'KoreanLearningHubDB';
const DB_VERSION = 1;

// List of all object stores, derived from apiClient's paths
const OBJECT_STORES = [
    'gamification_state',
    'srs_deck',
    'history_dictionary',
    'history_translation',
    'history_learning',
    'journal',
    'data_mnemonics',
    'data_playback',
    'data_grammar-progress',
    'data_onboarding',
    'data_error-stats',
    'data_stats',
    'data_user-settings',
    'data_user-profile'
];

let db: IDBDatabase;

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        if (db) {
            return resolve(db);
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error("IndexedDB error:", request.error);
            reject("IndexedDB error: " + request.error);
        };

        request.onsuccess = (event) => {
            db = request.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const dbInstance = (event.target as IDBOpenDBRequest).result;
            OBJECT_STORES.forEach(storeName => {
                if (!dbInstance.objectStoreNames.contains(storeName)) {
                    // We will store one entry per user in each store, keyed by user email.
                    dbInstance.createObjectStore(storeName);
                }
            });
        };
    });
}

export async function idbGet<T>(storeName: string, key: IDBValidKey): Promise<T | undefined> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(key);

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            console.error(`Error getting data from ${storeName}:`, request.error);
            reject(request.error);
        };
    });
}

export async function idbSet<T>(storeName: string, key: IDBValidKey, value: T): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(value, key);

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = () => {
            console.error(`Error setting data in ${storeName}:`, request.error);
            reject(request.error);
        };
    });
}

export async function idbDel(storeName: string, key: IDBValidKey): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(key);

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = () => {
            console.error(`Error deleting data from ${storeName}:`, request.error);
            reject(request.error);
        };
    });
}