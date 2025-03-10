import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userSession = request.cookies.get('user_session');

  // List of protected routes that require authentication
  const protectedRoutes = ['/bookings', '/profile'];

  if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route)) && !userSession) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/bookings/:path*', '/profile/:path*']
}; 