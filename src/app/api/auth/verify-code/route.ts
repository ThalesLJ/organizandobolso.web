import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const authBase = process.env.NEXT_PUBLIC_API_AUTH_URL || 'http://localhost:5000';
    const resp = await fetch(`${authBase}/api/auth/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await resp.json();
    return NextResponse.json(data, { status: resp.status });
  } catch {
    return NextResponse.json({ message: 'Failed to verify code' }, { status: 500 });
  }
}


