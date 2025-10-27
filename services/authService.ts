// services/authService.ts

// This is a mock authentication service.
// In a real application, this would make API calls to a backend.

export interface User {
  email: string;
  isVip: boolean;
  isAdmin: boolean;
}

const USERS_STORAGE_KEY = 'koreanAppUsers';
const USER_SESSION_KEY = 'currentUserEmail';

let users: User[] = [];

// Initialize users from localStorage or with default users
try {
  const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
  if (storedUsers) {
    users = JSON.parse(storedUsers);
  } else {
    // Default users if none are stored
    users = [
      { email: 'vip@example.com', isVip: true, isAdmin: false },
      { email: 'admin@example.com', isVip: true, isAdmin: true },
      { email: 'free@example.com', isVip: false, isAdmin: false },
    ];
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }
} catch (e) {
  console.error("Could not initialize user storage.", e);
}


const saveUsers = () => {
    try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
        console.error("Could not save users to localStorage.", e);
    }
};

const listeners: ((user: User | null) => void)[] = [];
let currentUser: User | null = null;

try {
    const currentUserEmail = sessionStorage.getItem(USER_SESSION_KEY);
    if (currentUserEmail) {
        currentUser = users.find(u => u.email === currentUserEmail) || null;
    }
} catch (e) {
    console.error("Could not read session storage.", e);
}


export const onAuthStateChanged = (callback: (user: User | null) => void): (() => void) => {
  listeners.push(callback);
  // Immediately call with current user
  setTimeout(() => callback(currentUser), 0);
  
  // Return an unsubscribe function
  return () => {
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
};

const notifyListeners = () => {
  listeners.forEach(listener => listener(currentUser));
};

export const login = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find(u => u.email === email);
      if (user) {
        currentUser = user;
        try {
            sessionStorage.setItem(USER_SESSION_KEY, user.email);
        } catch(e) { console.error(e); }
        notifyListeners();
        resolve(user);
      } else {
        reject(new Error('Tài khoản không tồn tại hoặc mật khẩu sai.'));
      }
    }, 500);
  });
};

export const signup = (email: string, password: string): Promise<User> => {
   return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (users.some(u => u.email === email)) {
        reject(new Error('Email đã được sử dụng.'));
        return;
      }
      const newUser: User = { email, isVip: false, isAdmin: false };
      users.push(newUser);
      saveUsers();
      
      currentUser = newUser;
      try {
        sessionStorage.setItem(USER_SESSION_KEY, newUser.email);
      } catch(e) { console.error(e); }
      notifyListeners();
      resolve(newUser);
    }, 500);
  });
};

export const logout = (): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => {
      currentUser = null;
      try {
        sessionStorage.removeItem(USER_SESSION_KEY);
      } catch(e) { console.error(e); }
      notifyListeners();
      resolve();
    }, 200);
  });
};

export const loginWithProvider = (provider: 'google' | 'facebook' | 'zalo'): Promise<User> => {
    // This is a mock. In a real app, you'd use Firebase Auth or another provider.
    // For this mock, let's just log in a default user.
    return login('free@example.com', 'password');
};

// Admin functions
export const getAllUsers = (): Promise<User[]> => {
    return Promise.resolve(users);
};

export const updateUser = (email: string, updates: Partial<User>): Promise<User | null> => {
    return new Promise((resolve) => {
        const userIndex = users.findIndex(u => u.email === email);
        if (userIndex > -1) {
            users[userIndex] = { ...users[userIndex], ...updates };
            saveUsers();
            resolve(users[userIndex]);
        } else {
            resolve(null);
        }
    });
};

export const getCurrentUser = (): User | null => {
    return currentUser;
}
