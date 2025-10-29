import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../config/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/api/auth/login', { email, password });
          const { token, user } = response.data;
          
          set({ user, token, isLoading: false });
          
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { 
            success: false, 
            error: error.response?.data?.message || 'Login failed' 
          };
        }
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/api/auth/register', userData);
          const { token, user } = response.data;
          
          set({ user, token, isLoading: false });
          
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { 
            success: false, 
            error: error.response?.data?.message || 'Registration failed' 
          };
        }
      },

      logout: () => {
        set({ user: null, token: null });
      },

      updateProfile: async (profileData) => {
        try {
          const response = await api.put('/api/auth/profile', profileData);
          set({ user: response.data });
          return { success: true };
        } catch (error) {
          return { 
            success: false, 
            error: error.response?.data?.message || 'Update failed' 
          };
        }
      },

      initializeAuth: () => {
        // Auth is handled by the api interceptor
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);

export { useAuthStore };