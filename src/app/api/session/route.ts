import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/jwt';

export async function GET() {
      const cookieStore = await cookies();
      const token = cookieStore.get('token')?.value;
      if (!token) return NextResponse.json({ user: null });
      const payload = await verifyJwt(token);
      if (!payload) return NextResponse.json({ user: null });
      return NextResponse.json({ user: payload });
}
