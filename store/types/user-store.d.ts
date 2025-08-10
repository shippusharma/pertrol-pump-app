import type { IUserSchema } from '../../model/types/user';
import type { ERoleType } from '../../types/enums';

/**
 * User profile information stored in the store
 * Extends the base user schema with additional computed properties
 */
export interface UserProfile extends Omit<IUserSchema, 'password' | 'Document'> {
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Authentication tokens for secure API access
 */
export interface AuthTokens {
  /** Short-lived access token for API requests */
  accessToken: string;
  /** Long-lived refresh token for renewing access */
  refreshToken: string;
  /** When the access token expires */
  accessTokenExpiresAt: Date;
  /** When the refresh token expires */
  refreshTokenExpiresAt: Date;
}

/**
 * User session information
 */
export interface UserSession {
  /** Whether user is currently authenticated */
  isAuthenticated: boolean;
  /** When user last logged in */
  lastLoginAt: Date;
  /** User's current device information */
  deviceInfo: {
    deviceId: string;
    platform: 'ios' | 'android' | 'web';
    appVersion: string;
  };
}

/**
 * User preferences and settings
 */
export interface UserPreferences {
  /** User's preferred language */
  language: string;
  /** User's preferred theme */
  theme: 'light' | 'dark' | 'system';
  /** User's timezone */
  timezone: string;
  /** User's notification preferences */
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
    marketing: boolean;
  };
}

/**
 * Complete user store state
 */
export interface UserStoreState {
  // Core user data
  profile: UserProfile | null;
  tokens: AuthTokens | null;
  session: UserSession | null;
  preferences: UserPreferences | null;

  // Store state
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Computed properties
  isLoggedIn: boolean;
  hasValidTokens: boolean;
  userRole: ERoleType | null;
}

/**
 * Actions that can be performed on the user store
 */
export interface UserStoreActions {
  // Authentication actions
  login: (userData: { profile: UserProfile; tokens: AuthTokens }) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<void>;

  // Profile management
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateAvatar: (avatarUrl: string) => Promise<void>;

  // Session management
  updateSession: (sessionData: Partial<UserSession>) => void;
  clearSession: () => void;

  // Preferences management
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;

  // Store utilities
  clearStore: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => Promise<void>;
}

/**
 * Complete user store type combining state and actions
 */
export type UserStore = UserStoreState & UserStoreActions;

/**
 * User store selector type for optimized re-renders
 */
export type UserStoreSelector<T> = (state: UserStoreState) => T;

/**
 * User store middleware type for persistence and security
 */
export type UserStoreMiddleware = (config: any) => (set: any, get: any, api: any) => any;
