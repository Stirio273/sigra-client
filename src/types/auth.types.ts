// src/types/auth.types.ts

export interface User {
  userGuid: string;
  user: string;
  isAuthenticated: boolean;
  role: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  checkAuth: () => Promise<void>;
}
