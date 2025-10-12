import { User } from '@/types';

export interface JwtPayload {
  sub: string;
  username: string;
  email: string;
  iat: number;
  exp: number;
}

// Função simples para decodificar JWT sem verificar assinatura (apenas para validação de expiração)
function decodeJWT(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded;
  } catch {
    
    return null;
  }
}

export function isTokenValid(token: string): boolean {
  try {
    
    
    const decoded = decodeJWT(token);
    if (!decoded) {
      
      return false;
    }
    
    const now = Math.floor(Date.now() / 1000);
    
    const isValid = decoded.exp > now;
    
    return isValid;
  } catch {
    
    return false;
  }
}

export function getTokenFromStorage(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const token = localStorage.getItem('token');
  return token;
}

export function setTokenInStorage(token: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem('token', token);
}

export function removeTokenFromStorage(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
}

export function getCurrentUser(): User | null {
  const token = getTokenFromStorage();
  
  if (!token || !isTokenValid(token)) {
    return null;
  }

  try {
    const decoded = decodeJWT(token);
    if (!decoded) {
      return null;
    }
    
    const user = {
      id: decoded.sub,
      username: decoded.username,
      email: decoded.email,
    };
    return user;
  } catch {
    
    return null;
  }
}

export function isAuthenticated(): boolean {
  const token = getTokenFromStorage();
  if (!token) {
    return false;
  }
  const isValid = isTokenValid(token);
  return isValid;
}
