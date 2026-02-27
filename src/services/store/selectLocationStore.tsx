import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type State = {
  isOpen: boolean;
  location: string;
  updateLocation: (location: string) => void;
  updateModalOpen: (value: boolean) => void;
};

export const useLocationState = create(
  persist<State>(
    (set) => ({
      isOpen: false,
      location: '',
      updateLocation: (location: string) => set(() => ({ location })),
      updateModalOpen: (value: boolean) => set(() => ({ isOpen: value })),
    }),
    {
      name: 'location',
    }
  )
);
