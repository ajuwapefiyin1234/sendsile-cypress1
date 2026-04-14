import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type State = {
  userData: any | null;
  setUserData: (user: any) => void;
};

export const userProfileState = create(
  persist<State>(
    (set) => ({
      userData: null,
      setUserData: (user: any) => set(() => ({ userData: user })),
    }),
    {
      name: 'userInfo',
    }
  )
);
