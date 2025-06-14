import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/notes',
  '/tasks',
  '/issues',
  '/settings',
  '/team',
  '/analytics',
  '/search',
  '/favorites',
  '/calendar',
  '/comments',
  '/reports'
];

// Define routes that bypass authentication (for testing)
const bypassRoutes = ['/test-auth', '/test-create', '/test-fetch'];

// Define routes that redirect to dashboard if already authenticated
const authRoutes = ['/login', '/register'];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the current path should bypass auth
  const isBypassRoute = bypassRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  if (isBypassRoute) {
    return NextResponse.next();
  }
  
  // Check if user has auth token (simplified check)
  const authToken = request.cookies.get('auth_token')?.value || 
                   request.headers.get('authorization');
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // If accessing a protected route without auth, redirect to login
  if (isProtectedRoute && !authToken) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  // If accessing auth routes while authenticated, redirect to dashboard
  if (isAuthRoute && authToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
