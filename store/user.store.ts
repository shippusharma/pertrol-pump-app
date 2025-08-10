import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { ERoleType } from '../types/enums';
import type { AuthTokens, UserPreferences, UserProfile, UserSession, UserStore } from './types/user-store';

/**
 * Default user preferences
 */
const DEFAULT_USER_PREFERENCES: UserPreferences = {
  language: 'en',
  theme: 'system',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  notifications: {
    push: true,
    email: true,
    sms: false,
    marketing: false,
  },
};

/**
 * Default user session
 */
const DEFAULT_USER_SESSION: UserSession = {
  isAuthenticated: false,
  lastLoginAt: new Date(),
  deviceInfo: {
    deviceId: '',
    platform: 'web',
    appVersion: '1.0.0',
  },
};

/**
 * Initial store state
 */
const initialState = {
  // Core user data
  profile: null,
  tokens: null,
  session: DEFAULT_USER_SESSION,
  preferences: DEFAULT_USER_PREFERENCES,

  // Store state
  isLoading: false,
  isInitialized: false,
  error: null,

  // Computed properties
  isLoggedIn: false,
  hasValidTokens: false,
  userRole: null,
};

/**
 * Computed state selectors for optimized re-renders
 */
const selectors = {
  // User profile selectors
  selectUserProfile: (state: UserStore) => state.profile,
  selectUserName: (state: UserStore) => state.profile?.name,
  selectUserEmail: (state: UserStore) => state.profile?.email,
  selectUserRole: (state: UserStore) => state.profile?.role,
  selectUserAvatar: (state: UserStore) => state.profile?.avatar,

  // Authentication selectors
  selectIsLoggedIn: (state: UserStore) => state.isLoggedIn,
  selectHasValidTokens: (state: UserStore) => state.hasValidTokens,
  selectAuthTokens: (state: UserStore) => state.tokens,

  // Session selectors
  selectSession: (state: UserStore) => state.session,
  selectIsAuthenticated: (state: UserStore) => state.session?.isAuthenticated,

  // Preferences selectors
  selectPreferences: (state: UserStore) => state.preferences,
  selectTheme: (state: UserStore) => state.preferences?.theme,
  selectLanguage: (state: UserStore) => state.preferences?.language,

  // Store state selectors
  selectIsLoading: (state: UserStore) => state.isLoading,
  selectIsInitialized: (state: UserStore) => state.isInitialized,
  selectError: (state: UserStore) => state.error,
};

/**
 * Utility functions for token validation and management
 */
const tokenUtils = {
  /**
   * Check if access token is valid and not expired
   */
  isAccessTokenValid: (tokens: AuthTokens | null): boolean => {
    if (!tokens?.accessToken) return false;

    try {
      const now = new Date();
      return now < tokens.accessTokenExpiresAt;
    } catch {
      return false;
    }
  },

  /**
   * Check if refresh token is valid and not expired
   */
  isRefreshTokenValid: (tokens: AuthTokens | null): boolean => {
    if (!tokens?.refreshToken) return false;

    try {
      const now = new Date();
      return now < tokens.refreshTokenExpiresAt;
    } catch {
      return false;
    }
  },

  /**
   * Check if tokens need refresh (within 5 minutes of expiry)
   */
  needsTokenRefresh: (tokens: AuthTokens | null): boolean => {
    if (!tokens?.accessTokenExpiresAt) return false;

    try {
      const now = new Date();
      const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);
      return fiveMinutesFromNow >= tokens.accessTokenExpiresAt;
    } catch {
      return false;
    }
  },
};

/**
 * Main user store implementation
 */
export const useUserStore = create<UserStore>()(
  devtools(
    subscribeWithSelector((set, get, api) => ({
      ...initialState,

      /**
       * Initialize the store and restore persisted data
       */
      initialize: async () => {
        try {
          set({ isLoading: true, error: null });

          // Update computed properties
          set({});
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to restore user data',
            isInitialized: true,
            isLoading: false,
          });
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Login user and store authentication data
       */
      login: async (userData: { profile: UserProfile; tokens: AuthTokens }) => {
        try {
          set({ isLoading: true, error: null });

          // Validate tokens
          if (!tokenUtils.isAccessTokenValid(userData.tokens)) {
            throw new Error('Invalid access token provided');
          }

          // Update device info
          const updatedSession: UserSession = {
            ...DEFAULT_USER_SESSION,
            isAuthenticated: true,
            lastLoginAt: new Date(),
            deviceInfo: {
              deviceId: `device_${Date.now()}`,
              platform: 'ios', // This should be dynamically detected
              appVersion: '1.0.0', // This should be dynamically detected
            },
          };

          const newState = {
            profile: userData.profile,
            tokens: userData.tokens,
            session: updatedSession,
            isLoggedIn: true,
            hasValidTokens: true,
            userRole: userData.profile.role,
            error: null,
          };

          set(newState);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({ error: errorMessage });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Logout user and clear all data
       */
      logout: async () => {
        try {
          set({ isLoading: true, error: null });

          // Reset to initial state
          set({ ...initialState, isInitialized: true });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Logout failed' });
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Refresh authentication tokens
       */
      refreshTokens: async () => {
        try {
          const { tokens } = get();

          if (!tokens || !tokenUtils.isRefreshTokenValid(tokens)) {
            throw new Error('No valid refresh token available');
          }

          set({ isLoading: true, error: null });

          // TODO: Implement actual token refresh API call
          // const newTokens = await authService.refreshTokens(tokens.refreshToken);

          // For now, we'll simulate a successful refresh
          const newTokens: AuthTokens = {
            ...tokens,
            accessTokenExpiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
          };

          set({
            tokens: newTokens,
            hasValidTokens: tokenUtils.isAccessTokenValid(newTokens),
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Token refresh failed';
          set({ error: errorMessage });

          // If refresh fails, logout the user
          if (errorMessage.includes('No valid refresh token')) {
            await get().logout();
          }
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Update user profile information
       */
      updateProfile: async (updates: Partial<UserProfile>) => {
        try {
          set({ isLoading: true, error: null });

          const { profile } = get();
          if (!profile) {
            throw new Error('No user profile to update');
          }

          // TODO: Implement actual profile update API call
          // await userService.updateProfile(profile._id, updates);

          const updatedProfile: UserProfile = {
            ...profile,
            ...updates,
            updatedAt: new Date(),
          };

          set({
            profile: updatedProfile,
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
          set({ error: errorMessage });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Update user avatar
       */
      updateAvatar: async (avatarUrl: string) => {
        try {
          set({ isLoading: true, error: null });

          const { profile } = get();
          if (!profile) {
            throw new Error('No user profile to update');
          }

          // TODO: Implement actual avatar update API call
          // await userService.updateAvatar(profile._id, avatarUrl);

          const updatedProfile: UserProfile = {
            ...profile,
            avatar: {
              url: avatarUrl,
              key: `avatar_${Date.now()}`,
              bucket: 'user-avatars',
              region: 'us-east-1',
            },
            updatedAt: new Date(),
          };

          set({
            profile: updatedProfile,
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Avatar update failed';
          set({ error: errorMessage });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Update user session information
       */
      updateSession: (sessionData: Partial<UserSession>) => {
        const { session } = get();
        if (session) {
          set({
            session: { ...session, ...sessionData },
            error: null,
          });
        }
      },

      /**
       * Clear user session
       */
      clearSession: () => {
        set({
          session: DEFAULT_USER_SESSION,
          error: null,
        });
      },

      /**
       * Update user preferences
       */
      updatePreferences: async (preferences: Partial<UserPreferences>) => {
        try {
          set({ isLoading: true, error: null });

          const { preferences: currentPreferences } = get();
          if (!currentPreferences) {
            throw new Error('No user preferences to update');
          }

          // TODO: Implement actual preferences update API call
          // await userService.updatePreferences(userId, preferences);

          const updatedPreferences: UserPreferences = {
            ...currentPreferences,
            ...preferences,
          };

          set({
            preferences: updatedPreferences,
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Preferences update failed';
          set({ error: errorMessage });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Clear the entire store
       */
      clearStore: () => {
        set(initialState);
      },

      /**
       * Set error message
       */
      setError: (error: string | null) => {
        set({ error });
      },

      /**
       * Set loading state
       */
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    })),
    {
      name: 'user-store',
      enabled: __DEV__,
    }
  )
);

/**
 * Optimized selectors for common use cases
 * These selectors use shallow comparison to prevent unnecessary re-renders
 */
export const useUserSelectors = {
  // Profile selectors
  useProfile: () => useUserStore(selectors.selectUserProfile),
  useUserName: () => useUserStore(selectors.selectUserName),
  useUserEmail: () => useUserStore(selectors.selectUserEmail),
  useUserRole: () => useUserStore(selectors.selectUserRole),
  useUserAvatar: () => useUserStore(selectors.selectUserAvatar),

  // Authentication selectors
  useIsLoggedIn: () => useUserStore(selectors.selectIsLoggedIn),
  useHasValidTokens: () => useUserStore(selectors.selectHasValidTokens),
  useAuthTokens: () => useUserStore(selectors.selectAuthTokens),

  // Session selectors
  useSession: () => useUserStore(selectors.selectSession),
  useIsAuthenticated: () => useUserStore(selectors.selectIsAuthenticated),

  // Preferences selectors
  usePreferences: () => useUserStore(selectors.selectPreferences),
  useTheme: () => useUserStore(selectors.selectTheme),
  useLanguage: () => useUserStore(selectors.selectLanguage),

  // Store state selectors
  useIsLoading: () => useUserStore(selectors.selectIsLoading),
  useIsInitialized: () => useUserStore(selectors.selectIsInitialized),
  useError: () => useUserStore(selectors.selectError),
};

/**
 * Custom hooks for specific use cases
 */
export const useUserHooks = {
  /**
   * Hook to check if user has specific role
   */
  useHasRole: (role: ERoleType) => {
    const userRole = useUserStore(selectors.selectUserRole);
    return userRole === role;
  },

  /**
   * Hook to check if user has any of the specified roles
   */
  useHasAnyRole: (roles: ERoleType[]) => {
    const userRole = useUserStore(selectors.selectUserRole);
    return userRole ? roles.includes(userRole) : false;
  },

  /**
   * Hook to get user's display name (fallback to email if name is not available)
   */
  useDisplayName: () => {
    const name = useUserStore(selectors.selectUserName);
    const email = useUserStore(selectors.selectUserEmail);
    return name || email || 'Unknown User';
  },

  /**
   * Hook to check if user profile is complete
   */
  useIsProfileComplete: () => {
    const profile = useUserStore(selectors.selectUserProfile);
    if (!profile) return false;

    return !!(
      profile.name &&
      profile.email &&
      profile.phoneNumber &&
      profile.isEmailVerified &&
      profile.isPhoneNumberVerified
    );
  },
};

/**
 * Export the main store and all utilities
 */
export { selectors, tokenUtils };
export default useUserStore;
