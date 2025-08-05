/* eslint-disable no-console */
import { DUMMY_TOKENS, DUMMY_USERS } from '../app/api/data';
import { AuthTokens, LoginRequest, RegisterRequest, User } from '../types/auth';
import { authStorage } from './auth-storage';

export const authService = {
  async login(credentials: LoginRequest): Promise<{ user: User; tokens: AuthTokens }> {
    try {
      // const response = await api.post('/auth/login', credentials);
      // const { user, accessToken, refreshToken } = response.data;

      // Store tokens securely
      await authStorage.setAuth(DUMMY_TOKENS.accessToken, DUMMY_TOKENS.refreshToken);

      return {
        user: DUMMY_USERS[0],
        tokens: {
          accessToken: DUMMY_TOKENS.accessToken,
          refreshToken: DUMMY_TOKENS.refreshToken,
        },
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  async register(userData: RegisterRequest): Promise<{ user: User; tokens: AuthTokens }> {
    try {
      // const response = await api.post('/auth/register', userData);
      // const { user, accessToken, refreshToken } = response.data;

      // Store tokens securely
      await authStorage.setAuth(DUMMY_TOKENS.accessToken, DUMMY_TOKENS.refreshToken);

      return {
        user: DUMMY_USERS[0],
        tokens: {
          accessToken: DUMMY_TOKENS.accessToken,
          refreshToken: DUMMY_TOKENS.refreshToken,
        },
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  async logout(): Promise<void> {
    try {
      // await api.post('/auth/logout');
      await authStorage.deleteAuth();
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      // const response = await api.get('/auth/me');
      // return response.data.user;
      return DUMMY_USERS[0];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get user');
    }
  },

  async getStoredTokens(): Promise<AuthTokens | null> {
    try {
      const { accessToken, refreshToken } = await authStorage.getAuth();

      if (accessToken && refreshToken) {
        return { accessToken, refreshToken };
      }
      return null;
    } catch (error) {
      console.error('Error getting stored tokens:', error);
      return null;
    }
  },
};
