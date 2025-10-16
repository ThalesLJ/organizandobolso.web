import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const authBase = process.env.NEXT_PUBLIC_API_AUTH_URL || 'http://localhost:5000';
    const resp = await fetch(`${authBase}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await resp.json();
    if (!resp.ok) {
      return NextResponse.json({ message: data.message || 'Unauthorized' }, { status: resp.status });
    }

    const token = data.token as string;
    const response = NextResponse.json({ user: data.user, token });
    response.cookies.set('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}


