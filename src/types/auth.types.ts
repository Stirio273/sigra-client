// src/types/auth.types.ts

export interface User {
  username: string;
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
