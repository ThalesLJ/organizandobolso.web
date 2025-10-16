 
import { LoginRequest, RegisterRequest, AuthResponse } from '@/types';
import { setTokenInStorage, removeTokenFromStorage } from '@/lib/auth';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch('/api/session/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || 'Login failed');
    }
    setTokenInStorage(data.token);
    return data;
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch('/api/session/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || 'Registration failed');
    }
    setTokenInStorage(data.token);
    return data;
  },

  logout(): void {
    removeTokenFromStorage();
    fetch('/api/session/logout', { method: 'POST' });
  },
};
