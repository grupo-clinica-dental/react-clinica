import { create } from "zustand";

export const useAuthStore2 = create()((set) => ({
    token: '',
    profile: null,
    isAuth: false,
    setToken: (token) => set(() => ({ token, isAuth: true })),
    setProfile: (profile) => set(() => ({ profile })),
    logout: () => set(() => ({ token: '', isAuth: false, profile: null })),
  }));
  