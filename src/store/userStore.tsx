import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  userName: string | null;
  setUserName: (token: string | null) => void;
  clearUserName: () => void;
}

export const useUserStore = create<AuthState>()(
  persist(
    (set) => ({
      userName: null,
      setUserName: (userName) => set({ userName }),
      clearUserName: () => set({ userName: null }),
    }),
    {
      name: 'user-store',
    }
  )
);
