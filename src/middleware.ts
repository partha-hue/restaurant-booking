import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

function getAdminEmails() {
  const raw = process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || '';
  return raw
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicAdminRequestPage = pathname === '/admin/request-access';
  const isPublicAdminRequestApi = pathname === '/api/admin/requests';
  const isAdminPath = (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) && !isPublicAdminRequestPage && !isPublicAdminRequestApi;

  if (!isAdminPath) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const email = (token?.email || '').toLowerCase();
  const isAdmin = Boolean(token?.isAdmin) || getAdminEmails().includes(email);

  if (!token || !isAdmin) {
    if (pathname.startsWith('/api/admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (token && !isAdmin) {
      const requestUrl = new URL('/admin/request-access', request.url);
      requestUrl.searchParams.set('state', 'not-approved');
      requestUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(requestUrl);
    }

    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
