import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type State = {
  categoryID: string;
  setId: (id: string) => void;
};

export const useSetCategoryIdStore = create(
  persist<State>(
    (set) => ({
      categoryID: '',
      setId: (id: string) => set(() => ({ categoryID: id })),
    }),
    {
      name: 'category-id',
    }
  )
);
