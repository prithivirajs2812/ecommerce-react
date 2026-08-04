// src/store/useAuthStore.jsx
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

function extractRoles(accessToken) {
  try {
    const decoded = jwtDecode(accessToken);
    return decoded.roles || [];
  } catch {
    return [];
  }
}

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      roles: [],

      login: (authResponse) => {
        const { userId, email, accessToken, refreshToken } = authResponse;
        set({
          user: { userId, email },
          accessToken,
          refreshToken,
          roles: extractRoles(accessToken),
        });
      },

      // Called by the axios interceptor after a silent token refresh —
      // keeps roles in sync in case they changed (e.g. admin promotion)
      // without requiring a full logout/login cycle to pick up new claims
      // for the CURRENT session's remaining lifetime.
      updateAccessToken: (accessToken) => {
        set({ accessToken, roles: extractRoles(accessToken) });
      },

      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null, roles: [] });
      },
    }),
    {
      name: 'auth',
    }
  )
);

export default useAuthStore;