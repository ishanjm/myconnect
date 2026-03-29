import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/utils/jwt';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;
  const path = req.nextUrl.pathname;

  // Define public routes that don't require authentication
  const isPublicRoute = 
    path.startsWith('/login') || 
    path.startsWith('/register') || 
    path.startsWith('/api/auth') ||
    path.startsWith('/api-docs');

  let isTokenValid = false;

  if (token) {
    try {
      await verifyToken(token);
      isTokenValid = true;
    } catch (error) {
      // Token exists but is invalid/expired
      isTokenValid = false;
    }
  }

  // Logic for Public routes (like login/register) -> redirect to home if already logged in
  if (isPublicRoute) {
    // Only redirect to home if it's the web UI pages, not the API routes
    if (isTokenValid && !path.startsWith('/api/') && !path.startsWith('/api-docs')) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    // Allow public access
    return NextResponse.next();
  }

  // Logic for Protected routes
  if (!isTokenValid) {
    // Redirect to login if user isn't authenticated
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
