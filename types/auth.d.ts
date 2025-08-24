import { ERoleType } from './enums';

export interface User {
  id: string;
  email: string;
  name: string;
  role: ERoleType;
  phoneNumber?: string;
  avatar?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  phoneNumber?: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  isLoading: boolean;
  user: User | null;
  tokens: AuthTokens | null;
}
