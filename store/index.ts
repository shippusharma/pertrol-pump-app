/**
 * User Store - Comprehensive State Management for User Data
 *
 * This module provides a complete solution for managing user state in the petrol pump app,
 * including authentication, profile management, preferences, and secure persistence.
 *
 * Features:
 * - Secure data persistence with encryption
 * - Cross-platform storage (iOS, Android, Web)
 * - Optimized selectors for performance
 * - Type-safe state management
 * - Comprehensive error handling
 * - Token management and validation
 * - User preferences and session management
 *
 * @example
 * ```tsx
 * import { useUserStore, useUserSelectors, useUserHooks } from '@/store';
 *
 * // Basic usage
 * const { login, logout, profile } = useUserStore();
 *
 * // Optimized selectors
 * const isLoggedIn = useUserSelectors.useIsLoggedIn();
 * const userName = useUserSelectors.useUserName();
 *
 * // Custom hooks
 * const hasRole = useUserHooks.useHasRole('admin');
 * const displayName = useUserHooks.useDisplayName();
 * ```
 */

// Main store exports
import { useUserHooks, useUserSelectors, useUserStore } from './user.store';

export { selectors, tokenUtils, useUserHooks, useUserSelectors, default as useUserStore } from './user.store';

// Type exports
export type {
  AuthTokens,
  UserPreferences,
  UserProfile,
  UserSession,
  UserStore,
  UserStoreActions,
  UserStoreMiddleware,
  UserStoreSelector,
  UserStoreState,
} from './types/user-store';

// Re-export Zustand utilities for advanced usage
export { subscribeWithSelector } from 'zustand/middleware';
export { shallow } from 'zustand/shallow';

/**
 * Store initialization utility
 * Call this function when the app starts to restore persisted user data
 */
export const initializeUserStore = async () => {
  const { useUserStore } = await import('./user.store');
  const store = useUserStore.getState();
  await store.initialize();
};

/**
 * Store cleanup utility
 * Call this function when the app is about to close or user logs out
 */
export const cleanupUserStore = async () => {
  const { useUserStore } = await import('./user.store');
  const store = useUserStore.getState();
  await store.logout();
};

/**
 * Store health check utility
 * Use this to verify the store is working correctly
 */
export const checkUserStoreHealth = () => {
  const store = useUserStore.getState();

  return {
    isInitialized: store.isInitialized,
    hasProfile: !!store.profile,
    hasTokens: !!store.tokens,
    isLoggedIn: store.isLoggedIn,
    hasValidTokens: store.hasValidTokens,
    error: store.error,
  };
};

/**
 * Store migration utility
 * Use this when you need to migrate user data between versions
 */
export const migrateUserStore = async (fromVersion: string, toVersion: string) => {
  // TODO: Implement migration logic based on version differences
  // This could involve:
  // - Restructuring data
  // - Adding new fields with defaults
  // - Removing deprecated fields
  // - Converting data formats

  return { success: true, migrated: true };
};

/**
 * Store performance monitoring
 */
export const monitorUserStorePerformance = () => {
  const startTime = performance.now();

  return {
    start: () => startTime,
    end: () => performance.now() - startTime,
    measure: (fn: () => void) => {
      const start = performance.now();
      fn();
      return performance.now() - start;
    },
  };
};

// Default export for convenience
export default {
  useUserStore: useUserStore,
  useUserSelectors: useUserSelectors,
  useUserHooks: useUserHooks,
  initializeUserStore,
  cleanupUserStore,
  checkUserStoreHealth,
  migrateUserStore,
  monitorUserStorePerformance,
};
