// NOTE FOR PRODUCTION:
// This is a MOCK API client that simulates a real backend using IndexedDB.
// For a real-world application, the `mockFetch` function should be replaced
// with a real `fetch` call to a backend server. The logic inside `mockFetch`
// represents what the backend server would do.

import type { GamificationState } from '../types';
import { idbGet, idbSet, idbDel } from './idb';


const MOCK_API_DELAY = 150; // Simulate latency

// --- Mock Database (Users are still in-memory for simplicity) ---
const db = {
    users: {
        'user@example.com': { email: 'user@example.com', password: 'password', isVip: false, isAdmin: false },
        'vip@example.com': { email: 'vip@example.com', password: 'password', isVip: true, isAdmin: false },
        'admin@example.com': { email: 'admin@example.com', password: 'password', isVip: true, isAdmin: true },
    },
};

// --- Mock JWT Handling (using localStorage is fine for this) ---
const JWT_KEY = 'mock_jwt';
const getSession = () => localStorage.getItem(JWT_KEY);
const setSession = (email: string | null) => {
    if (email) {
        localStorage.setItem(JWT_KEY, email);
    } else {
        localStorage.removeItem(JWT_KEY);
    }
};
const clearSession = () => localStorage.removeItem(JWT_KEY);
const getUserFromSession = () => {
    const email = getSession();
    // @ts-ignore
    return email ? db.users[email] : null;
};

// --- Helper Functions ---
const getInitialGamificationState = (): GamificationState => ({
    xp: 0,
    level: 1,
    streak: 0,
    lastActivityDate: '1970-01-01',
    unlockedBadgeIds: [],
    uniqueDictionaryLookups: [],
    completedRolePlays: [],
    completedQuizzesCount: 0,
    createdConversationsCount: 0,
    analyzedSentencesCount: 0,
    grammarQuizStats: {},
    completedQuestIds: [],
});


// --- Mock API Router ---
const mockFetch = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
    const { method = 'GET', body } = options;
    const url = new URL(endpoint, 'http://mockapi.com');
    const path = url.pathname;
    const user = getUserFromSession();

    console.log(`[Mock API] ${method} ${path}`, { body: body ? JSON.parse(body as string) : undefined });

    // --- Helper to get user-specific data from mock db (now IndexedDB) ---
    const getUserData = async <T>(key: string, fallback: T): Promise<T> => {
        if (!user) return fallback;
        const data = await idbGet<T>(key, user.email);
        return data === undefined ? fallback : data;
    };

    // --- Helper to save user-specific data to mock db (now IndexedDB) ---
    const setUserData = async <T>(key: string, data: T): Promise<void> => {
        if (!user) return;
        await idbSet(key, user.email, data);
    };
    
    // --- Helper to delete user-specific data from mock db (now IndexedDB) ---
    const deleteUserData = async (key: string): Promise<void> => {
        if (!user) return;
        await idbDel(key, user.email);
    }

    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));

    // --- Auth Routes ---
    if (path === '/api/auth/login' && method === 'POST') {
        const { email, password } = JSON.parse(body as string);
        // @ts-ignore
        const foundUser = db.users[email];
        if (foundUser && (foundUser.password === password || password === undefined)) {
            setSession(email);
            return new Response(JSON.stringify(foundUser), { status: 200 });
        }
        return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
    }

    if (path === '/api/auth/signup' && method === 'POST') {
        const { email, password } = JSON.parse(body as string);
         // @ts-ignore
        if (db.users[email]) {
            return new Response(JSON.stringify({ message: 'User already exists' }), { status: 409 });
        }
        const newUser = { email, password, isVip: false, isAdmin: false };
         // @ts-ignore
        db.users[email] = newUser;
        setSession(email);
        return new Response(JSON.stringify(newUser), { status: 201 });
    }

    if (path === '/api/auth/logout' && method === 'POST') {
        clearSession();
        return new Response(null, { status: 204 });
    }

    if (path === '/api/auth/me' && method === 'GET') {
        if (user) {
            return new Response(JSON.stringify(user), { status: 200 });
        }
        return new Response(null, { status: 401 });
    }

    // --- Protected Routes ---
    if (!user) {
        return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    
    const protectedRoutes: Record<string, { fallback: any }> = {
        '/api/gamification/state': { fallback: getInitialGamificationState() },
        '/api/srs/deck': { fallback: [] },
        '/api/history/dictionary': { fallback: [] },
        '/api/history/translation': { fallback: [] },
        '/api/history/learning': { fallback: [] },
        '/api/journal': { fallback: { content: '', timestamp: null, status: 'none' } },
        '/api/data/mnemonics': { fallback: {} },
        '/api/data/playback': { fallback: {} },
        '/api/data/grammar-progress': { fallback: [] },
        '/api/data/onboarding': { fallback: false },
        '/api/data/error-stats': { fallback: { grammar: {}, vocab: {} } },
        '/api/data/stats': { fallback: { today: { listened: 0, tested: 0 }, thisMonth: { listened: 0, tested: 0 }, lastUpdated: new Date().toISOString().slice(0, 10) } },
        '/api/data/user-settings': { fallback: {} },
        '/api/data/user-profile': { fallback: { level: null } },
    };

    const routeConfig = protectedRoutes[path];

    if (routeConfig) {
        const key = path.replace('/api/', '').replace(/\//g, '_');
        
        if (method === 'GET') {
            const data = await getUserData(key, routeConfig.fallback);
            return new Response(JSON.stringify(data), { status: 200 });
        }
        if (method === 'POST') {
            const newData = JSON.parse(body as string);
            await setUserData(key, newData);
            return new Response(JSON.stringify(newData), { status: 200 });
        }
        if (method === 'DELETE') {
            await deleteUserData(key);
            return new Response(null, { status: 204 });
        }
    }


    return new Response(JSON.stringify({ message: 'Not Found' }), { status: 404 });
};


// --- API Client Class ---
class ApiClient {
    private token: string | null = null;

    constructor() {
        this.token = getSession();
    }

    private getHeaders() {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }
    
    setToken(token: string | null) {
        this.token = token;
        setSession(token);
    }
    
    getToken(): string | null {
        return this.token;
    }

    async get<T>(endpoint: string): Promise<T> {
        const response = await mockFetch(endpoint, {
            method: 'GET',
            headers: this.getHeaders(),
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(`API Error: ${error.message}`);
        }
        if (response.status === 204) return {} as T; // Handle No Content
        return response.json() as Promise<T>;
    }

    async post<T, U>(endpoint: string, body: T): Promise<U> {
        const response = await mockFetch(endpoint, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(body),
        });
        if (!response.ok) {
           const error = await response.json().catch(() => ({ message: response.statusText }));
           throw new Error(`API Error: ${error.message}`);
        }
        if (response.status === 204) return {} as U;
        return response.json() as Promise<U>;
    }
    
    async delete(endpoint: string): Promise<void> {
        const response = await mockFetch(endpoint, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });
        if (!response.ok) {
             const error = await response.json().catch(() => ({ message: response.statusText }));
             throw new Error(`API Error: ${error.message}`);
        }
    }
}

export const apiClient = new ApiClient();