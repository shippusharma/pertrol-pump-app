export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff' | 'manager';
  phoneNumber?: string;
  avatar?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  // phoneNumber: '';
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phoneNumber?: string;
  password: string;
}

export interface AuthState {
  isLoading: boolean;
  user: User | null;
  tokens: AuthTokens | null;
}
