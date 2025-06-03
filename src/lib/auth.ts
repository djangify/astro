// src/lib/auth.ts
import type {
  User,
  AuthResponse,
  RegisterData,
  LoginCredentials,
  PasswordChangeData,
  ProfileUpdateData,
  ApiError
} from "../types";

const API_BASE = import.meta.env.PUBLIC_API_BASE_URL || "https://corrison.corrisonapi.com";

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      detail: `HTTP ${response.status}: ${response.statusText}`
    }));
    throw error;
  }
  return response.json();
}

// Helper function to get auth headers
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

// Token management
export const tokenManager = {
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  },

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  },

  setTokens(access: string, refresh: string): void {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  },

  clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  async refreshAccessToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${API_BASE}/api/v1/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken })
    });

    if (!response.ok) {
      this.clearTokens();
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    this.setTokens(data.access, refreshToken);
    return data.access;
  }
};

// Authentication functions
export async function register(userData: RegisterData): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE}/api/v1/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });

  return handleResponse(response);
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/api/v1/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });

  const authData: AuthResponse = await handleResponse(response);

  // Store tokens and user data
  tokenManager.setTokens(authData.access, authData.refresh);
  localStorage.setItem('user', JSON.stringify(authData.user));

  return authData;
}

export async function logout(): Promise<void> {
  try {
    const refreshToken = tokenManager.getRefreshToken();
    if (refreshToken) {
      await fetch(`${API_BASE}/api/v1/auth/logout/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ refresh: refreshToken })
      });
    }
  } catch (error) {
    console.warn('Logout request failed:', error);
  } finally {
    tokenManager.clearTokens();
  }
}

export async function getCurrentUser(): Promise<User> {
  const response = await fetch(`${API_BASE}/api/v1/auth/profile/`, {
    headers: getAuthHeaders()
  });

  const user: User = await handleResponse(response);
  localStorage.setItem('user', JSON.stringify(user));
  return user;
}

export async function updateProfile(profileData: ProfileUpdateData): Promise<User> {
  const response = await fetch(`${API_BASE}/api/v1/auth/profile/`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData)
  });

  const user: User = await handleResponse(response);
  localStorage.setItem('user', JSON.stringify(user));
  return user;
}

export async function changePassword(passwordData: PasswordChangeData): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE}/api/v1/auth/change-password/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(passwordData)
  });

  return handleResponse(response);
}

export async function verifyEmail(token: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE}/api/v1/auth/verify-email/${token}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });

  return handleResponse(response);
}

export async function resendVerification(email: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE}/api/v1/auth/resend-verification/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });

  return handleResponse(response);
}

export async function requestPasswordReset(email: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE}/api/v1/auth/password-reset/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });

  return handleResponse(response);
}

export async function resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE}/api/v1/auth/password-reset-confirm/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token,
      password: newPassword
    })
  });

  return handleResponse(response);
}

// Authentication state helpers
export function isAuthenticated(): boolean {
  return !!tokenManager.getAccessToken();
}

export function getStoredUser(): User | null {
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
}

// API request wrapper with automatic token refresh
export async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  let token = tokenManager.getAccessToken();

  if (!token) {
    throw new Error('No access token available');
  }

  // First attempt
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  // If unauthorized, try to refresh token
  if (response.status === 401) {
    try {
      token = await tokenManager.refreshAccessToken();

      // Retry with new token
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      // Refresh failed, redirect to login
      tokenManager.clearTokens();
      window.location.href = '/auth/login';
      throw error;
    }
  }

  return response;
}