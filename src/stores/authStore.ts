// src/stores/authStore.ts
import type { User, LoginCredentials, RegisterData, ApiError } from '../types';
import {
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
  getCurrentUser,
  getStoredUser,
  isAuthenticated as checkIsAuthenticated,
  tokenManager
} from '../lib/auth';

// Authentication state interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Create a reactive store
class AuthStore {
  private state: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  };

  private listeners: Set<() => void> = new Set();

  constructor() {
    // Initialize from localStorage on creation
    this.initializeFromStorage();
  }

  // Subscribe to state changes
  subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Get current state
  getState(): AuthState {
    return { ...this.state };
  }

  // Private method to update state and notify listeners
  private setState(updates: Partial<AuthState>): void {
    this.state = { ...this.state, ...updates };
    this.listeners.forEach(callback => callback());
  }

  // Initialize state from localStorage
  private initializeFromStorage(): void {
    try {
      const storedUser = getStoredUser();
      const isAuth = checkIsAuthenticated();

      this.setState({
        user: storedUser,
        isAuthenticated: isAuth,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Failed to initialize auth from storage:', error);
      this.setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    }
  }

  // Login action
  async login(credentials: LoginCredentials): Promise<void> {
    this.setState({ isLoading: true, error: null });

    try {
      const authResponse = await apiLogin(credentials);

      this.setState({
        user: authResponse.user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage = apiError.detail ||
        apiError.non_field_errors?.[0] ||
        'Login failed. Please try again.';

      this.setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage
      });
      throw error;
    }
  }

  // Register action
  async register(userData: RegisterData): Promise<void> {
    this.setState({ isLoading: true, error: null });

    try {
      await apiRegister(userData);

      // Registration successful, but user needs to verify email
      this.setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    } catch (error) {
      const apiError = error as ApiError;
      let errorMessage = 'Registration failed. Please try again.';

      if (apiError.errors) {
        // Handle field-specific errors
        const errorMessages = Object.values(apiError.errors).flat();
        errorMessage = errorMessages.join(' ');
      } else if (apiError.detail) {
        errorMessage = apiError.detail;
      }

      this.setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage
      });
      throw error;
    }
  }

  // Logout action
  async logout(): Promise<void> {
    this.setState({ isLoading: true });

    try {
      await apiLogout();
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      this.setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    }
  }

  // Refresh user data
  async refreshUser(): Promise<void> {
    if (!this.state.isAuthenticated) return;

    this.setState({ isLoading: true, error: null });

    try {
      const user = await getCurrentUser();

      this.setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Failed to refresh user data:', error);

      // If refresh fails due to auth issues, logout
      if (error instanceof Error && error.message.includes('token')) {
        await this.logout();
      } else {
        this.setState({
          isLoading: false,
          error: 'Failed to refresh user data'
        });
      }
    }
  }

  // Clear error
  clearError(): void {
    this.setState({ error: null });
  }

  // Check if user has specific permission/role
  hasPermission(permission: string): boolean {
    // Implement based on your permission system
    // For now, just check if user is authenticated
    return this.state.isAuthenticated;
  }

  // Check if user email is verified
  isEmailVerified(): boolean {
    return this.state.user?.profile?.email_verified || false;
  }

  // Get user's full name
  getUserFullName(): string {
    if (!this.state.user) return '';
    return `${this.state.user.first_name} ${this.state.user.last_name}`.trim() || this.state.user.username;
  }

  // Get user's first name
  getUserFirstName(): string {
    if (!this.state.user) return '';
    return this.state.user.first_name?.trim() || '';
  }
}

// Create and export singleton instance
export const authStore = new AuthStore();

// Helper hook for reactive components
export function useAuth() {
  return authStore.getState();
}

// Helper to subscribe to auth changes in Astro components
export function subscribeToAuth(callback: () => void): () => void {
  return authStore.subscribe(callback);
}