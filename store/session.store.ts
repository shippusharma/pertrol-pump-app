// import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store'; // For secure token storage
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface ISessionInput {
  accessToken: string | null;
  refreshToken: string | null;
}

interface ISessionState {
  session: ISessionInput | null;
  isAuthenticated: () => boolean;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  getSession: () => ISessionInput | null;
  setSession: (session: ISessionInput) => void;
  updateSession: (updates: Partial<ISessionInput>) => void;
  reset: () => void;
}

const initialState = {
  session: null,
};

export const useSessionStore = create<ISessionState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        isAuthenticated: () => get().session?.accessToken !== null && get().session?.refreshToken !== null,
        getAccessToken: () => get().session?.accessToken ?? null,
        getRefreshToken: () => get().session?.refreshToken ?? null,
        getSession: () => get().session,
        setSession: session => set({ session }),
        updateSession: updates =>
          set(state =>
            state.session ? { session: { ...state.session, ...updates } } : { session: { ...updates } as ISessionInput }
          ),
        reset: () => set(initialState),
      }),
      {
        // Store name for persistence key in AsyncStorage.
        name: 'session_storage',
        // Use JSON storage adapter with AsyncStorage for React Native compatibility.
        storage: createJSONStorage(() => ({
          getItem: async (name: string) => {
            return await SecureStore.getItemAsync(name);
          },
          setItem: async (name: string, value: string) => {
            await SecureStore.setItemAsync(name, value);
          },
          removeItem: async (name: string) => {
            await SecureStore.deleteItemAsync(name);
          },
        })),
        // Excludes functions for efficient storage and avoids serialization issues.
        partialize: state => ({ session: state.session }),
      }
    ),
    {
      // Devtools config: Name the store for easy identification in devtools.
      name: 'session_store',
    }
  )
);
