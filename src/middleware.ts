import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/home', '/budgets', '/expenses'];
const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || '';

function uint8ArrayToB64url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  const b64 = btoa(binary);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

type JwtPayload = {
  sub?: string;
  username?: string;
  email?: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
};

async function verifyJwtHS256(token: string, secret: string): Promise<{ valid: boolean; payload?: JwtPayload }> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return { valid: false };
    const [headerB64, payloadB64, signatureB64] = parts;

    const headerJson = JSON.parse(atob(headerB64.replace(/-/g, '+').replace(/_/g, '/')));
    if (headerJson.alg !== 'HS256') return { valid: false };

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const data = enc.encode(`${headerB64}.${payloadB64}`);
    const signed = await crypto.subtle.sign('HMAC', key, data);
    const expectedSig = uint8ArrayToB64url(signed);
    if (expectedSig !== signatureB64) return { valid: false };

    const payloadJson = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')));
    const now = Math.floor(Date.now() / 1000);
    if (typeof payloadJson.exp === 'number' && payloadJson.exp <= now) return { valid: false };
    return { valid: true, payload: payloadJson };
  } catch {
    return { valid: false };
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (!JWT_SECRET) {
    return NextResponse.next();
  }

  const result = await verifyJwtHS256(token, JWT_SECRET);
  if (!result.valid) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
