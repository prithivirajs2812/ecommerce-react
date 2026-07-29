// src/store/useAuthStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      login: (authResponse) => {
        const { userId, email, accessToken, refreshToken } = authResponse;
        set({
          user: { userId, email },
          accessToken,
          refreshToken,
        });
      },

      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null });
      },
    }),
    {
      name: 'auth',
    }
  )
);

export default useAuthStore;