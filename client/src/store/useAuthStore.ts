import { create } from 'zustand';
import { UserProfile } from '../types/index.js';
import { api } from '../services/api.js';

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
  demoLogin: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUserPreferences: (prefs: any) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('freecv_auth_token'),
  isAuthenticated: !!localStorage.getItem('freecv_auth_token'),
  isLoading: true,

  login: (token, user) => {
    localStorage.setItem('freecv_auth_token', token);
    set({ token, user, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    localStorage.removeItem('freecv_auth_token');
    set({ token: null, user: null, isAuthenticated: false, isLoading: false });
  },

  demoLogin: async () => {
    try {
      set({ isLoading: true });
      const res = await api.demoLogin();
      localStorage.setItem('freecv_auth_token', res.token);
      set({
        token: res.token,
        user: { ...res.user, isDemo: true },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem('freecv_auth_token');
    if (!token) {
      set({ isLoading: false, isAuthenticated: false, user: null });
      return;
    }

    try {
      const user = await api.getMe();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      localStorage.removeItem('freecv_auth_token');
      set({ token: null, user: null, isAuthenticated: false, isLoading: false });
    }
  },

  updateUserPreferences: async (preferences) => {
    const { user } = get();
    if (!user) return;
    try {
      await api.updateProfile({ preferences });
      set({ user: { ...user, preferences } });
    } catch (e) {
      console.error('Failed to save preferences', e);
    }
  },
}));
