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
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
}

export interface AuthState {
  isLoading: boolean;
  user: User | null;
  tokens: AuthTokens | null;
}
