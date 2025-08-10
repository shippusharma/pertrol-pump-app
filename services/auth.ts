/* eslint-disable no-console */
import { serverWithApiVersion } from '@/configs';
import axios from 'axios';
import { AuthTokens, LoginRequest, RegisterRequest, User } from '../types/auth';
import { authStorage } from './session-storage';

export const authService = {
  async login(credentials: LoginRequest): Promise<{ user: User; tokens: AuthTokens }> {
    try {
      const response: any = await axios.post(`${serverWithApiVersion}/auth/login`, credentials);
      const { accessToken, refreshToken, payload } = response.data;

      console.log(response.data);

      // Store tokens securely
      await authStorage.setAuth(accessToken, refreshToken);

      return { user: payload, tokens: { accessToken, refreshToken } };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  async register(userData: RegisterRequest): Promise<{ user: User; tokens: AuthTokens }> {
    try {
      const response: any = await axios.post(`${serverWithApiVersion}/auth/register`, userData);
      const { accessToken, refreshToken, payload } = response.data;

      // Store tokens securely
      await authStorage.setAuth(accessToken, refreshToken);

      return { user: payload, tokens: { accessToken, refreshToken } };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  async logout(): Promise<void> {
    try {
      await axios.post(`${serverWithApiVersion}/auth/logout`);
      await authStorage.deleteAuth();
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const userId = '';
      const response: any = await axios.get(`${serverWithApiVersion}/users/${userId}`);
      const { payload } = response.data;

      // const response = await api.get('/auth/me');
      // return response.data.user;
      return payload;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get user');
    }
  },

  async getStoredTokens(): Promise<AuthTokens | null> {
    try {
      const { accessToken, refreshToken } = await authStorage.getAuth();
      if (accessToken && refreshToken) return { accessToken, refreshToken };
      return null;
    } catch (error) {
      console.error('Error getting stored tokens:', error);
      return null;
    }
  },
};
