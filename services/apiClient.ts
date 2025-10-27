import { idbGet, idbSet, idbDel } from './idb';

const USER_SESSION_KEY = 'currentUserEmail';

// This is a helper to get the current user's email from session storage.
// In a real app, this might come from a context or a more robust session management solution.
function getCurrentUserEmail(): string | null {
    try {
        return sessionStorage.getItem(USER_SESSION_KEY);
    } catch (e) {
        console.error("Could not access session storage:", e);
        return null;
    }
}

// Helper to sanitize path to be a valid store name
function getStoreName(path: string): string {
    return path.replace(/^\/api\//, '').replace(/\//g, '_');
}

async function get<T>(path: string): Promise<T> {
    const userEmail = getCurrentUserEmail();
    if (!userEmail) {
        throw new Error("User not authenticated");
    }
    const storeName = getStoreName(path);
    const data = await idbGet<Record<string, T>>(storeName, 'data');
    if (data && data[userEmail]) {
        return data[userEmail];
    }
    // Simulate 404 by throwing an error which will be caught by the caller
    throw new Error(`Data not found for user ${userEmail} at path ${path}`);
}

async function post<T, R>(path: string, body: T): Promise<R> {
    const userEmail = getCurrentUserEmail();
    if (!userEmail) {
        throw new Error("User not authenticated");
    }
    const storeName = getStoreName(path);
    const data = (await idbGet<Record<string, any>>(storeName, 'data')) || {};
    data[userEmail] = body;
    await idbSet(storeName, 'data', data);
    return body as unknown as R;
}

async function del(path: string): Promise<void> {
    const userEmail = getCurrentUserEmail();
    if (!userEmail) {
        // Silently fail on delete if not authenticated, or throw if strictness is needed
        return;
    }
    const storeName = getStoreName(path);
    const data = await idbGet<Record<string, any>>(storeName, 'data');
    if (data && data[userEmail]) {
        delete data[userEmail];
        await idbSet(storeName, 'data', data);
    }
}

export const apiClient = {
    get,
    post,
    delete: del,
};
