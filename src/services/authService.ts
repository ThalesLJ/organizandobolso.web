 
import { LoginRequest, RegisterRequest, AuthResponse } from '@/types';
import { setTokenInStorage, removeTokenFromStorage } from '@/lib/auth';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch('/api/session/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    }).then(r => r.json());
    setTokenInStorage(response.token);
    return response;
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch('/api/session/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    }).then(r => r.json());
    setTokenInStorage(response.token);
    return response;
  },

  logout(): void {
    removeTokenFromStorage();
    fetch('/api/session/logout', { method: 'POST' });
  },
};
