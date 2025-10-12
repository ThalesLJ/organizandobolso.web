import { apiAuthRequest } from '@/lib/api';
import { LoginRequest, RegisterRequest, AuthResponse } from '@/types';
import { setTokenInStorage, removeTokenFromStorage } from '@/lib/auth';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiAuthRequest<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    setTokenInStorage(response.token);
    // Also set cookie for middleware
    document.cookie = `token=${response.token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;
    return response;
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiAuthRequest<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    setTokenInStorage(response.token);
    // Also set cookie for middleware
    document.cookie = `token=${response.token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;
    return response;
  },

  logout(): void {
    removeTokenFromStorage();
    // Also remove cookie
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  },
};
