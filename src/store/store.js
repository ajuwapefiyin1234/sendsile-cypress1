import { create } from "zustand";
import {
  createJSONStorage,
  devtools,
  persist,
  subscribeWithSelector,
} from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createAuthSlice } from "./createAuthSlice";
import { createAuthActionsSlice } from "./createAuthActionsSlice";
import { createSettingSlice } from "./createSettingSlice";
import { createOrderSlice } from "./createOrderSlice";
import { createInventorySlice } from "./createInventorySlice";
import { createMemberSlice } from './createMemberSlice';
import { createTransactionsSlice } from './createTransactionsSlice';
import { createPartnerSlice } from './createPartnerSlice';

export const useStore = create()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get) => ({
          auth: createAuthSlice(set),
          authActions: createAuthActionsSlice(set, get),
          setting: createSettingSlice(set),
          order: createOrderSlice(set),
          inventory: createInventorySlice(set),
          member: createMemberSlice(set),
          transaction: createTransactionsSlice(set),
          partner: createPartnerSlice(set),
          // Add other slices here as needed
        }))
      ),
      {
        version: 0,
        name: 'vendor-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          auth: state.auth,
        }),
      }
    )
  )
);
