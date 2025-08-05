import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { router } from 'expo-router';
import { authService } from '../services/auth';
import { AuthState, User, AuthTokens, LoginRequest, RegisterRequest } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_TOKENS'; payload: AuthTokens | null };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_TOKENS':
      return { ...state, tokens: action.payload };
    default:
      return state;
  }
};

const initialState: AuthState = { isLoading: false, user: null, tokens: null };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    dispatch({ type: 'LOADING', payload: true });
    try {
      const tokens = await authService.getStoredTokens();
      const user = await authService.getCurrentUser();
      if (tokens && user) {
        dispatch({ type: 'SET_TOKENS', payload: tokens });
        dispatch({ type: 'SET_USER', payload: user });
      }
    } catch (error) {
      throw error;
    } finally {
      dispatch({ type: 'LOADING', payload: false });
    }
  };

  const login = async (credentials: LoginRequest) => {
    dispatch({ type: 'LOADING', payload: true });
    try {
      const { user, tokens } = await authService.login(credentials);
      dispatch({ type: 'SET_USER', payload: user });
      dispatch({ type: 'SET_TOKENS', payload: tokens });
    } catch (error) {
      throw error;
    } finally {
      dispatch({ type: 'LOADING', payload: false });
    }
  };

  const register = async (userData: RegisterRequest) => {
    dispatch({ type: 'LOADING', payload: true });
    try {
      const { user, tokens } = await authService.register(userData);
      dispatch({ type: 'SET_USER', payload: user });
      dispatch({ type: 'SET_TOKENS', payload: tokens });
    } catch (error) {
      throw error;
    } finally {
      dispatch({ type: 'LOADING', payload: false });
    }
  };

  const logout = async () => {
    dispatch({ type: 'LOADING', payload: true });
    try {
      await authService.logout();
      router.replace('/login');
    } catch (error) {
      throw error;
    } finally {
      dispatch({ type: 'LOADING', payload: false });
    }
  };

  const refreshUser = async () => {
    dispatch({ type: 'LOADING', payload: true });
    try {
      const user = await authService.getCurrentUser();
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      throw error;
    } finally {
      dispatch({ type: 'LOADING', payload: false });
    }
  };

  const isAuthenticated = state.tokens != null && state.user != null;

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
