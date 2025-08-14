import type { IUserInput } from '@/model/types/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

type UserInput = Omit<IUserInput, 'password'>;

interface IUserState {
  user: UserInput | null;
  isLoggedIn: () => boolean;
  getUser: () => UserInput | null;
  setUser: (user: UserInput) => void;
  updateUser: (updates: Partial<UserInput>) => void;
  reset: () => void;
}

const initialState = {
  user: null,
};

export const useUserStore = create<IUserState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        isLoggedIn: () => !!get().user,
        getUser: () => get().user,
        setUser: user => set({ user }),
        updateUser: updates =>
          set(state => (state.user ? { user: { ...state.user, ...updates } } : { user: { ...updates } as UserInput })),
        reset: () => set(initialState),
      }),
      {
        // Store name for persistence key in AsyncStorage.
        name: 'user_storage',
        // Use JSON storage adapter with AsyncStorage for React Native compatibility.
        storage: createJSONStorage(() => AsyncStorage),
        // Excludes functions for efficient storage and avoids serialization issues.
        partialize: state => ({ user: state.user }),
      }
    ),
    {
      // Devtools config: Name the store for easy identification in devtools.
      name: 'user_store',
    }
  )
);
