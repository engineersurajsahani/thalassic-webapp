import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ISSUE-010: Middleware for server-side route protection
// This prevents unauthorized access to protected routes at the server level
// before the page even renders

const PROTECTED_ROUTES = [
  '/dashboard',
  '/master',
  '/agent-admin',
  '/agent',
  '/company-admin',
  '/seafarer',
  '/seafearer',
];

const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/reset-password',
  '/forgot-password',
  '/',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathname.startsWith(route)
  );

  const isPublicRoute = PUBLIC_ROUTES.some(route =>
    pathname === route || pathname.startsWith(route)
  );

  // Get the auth token from cookies
  const authToken = request.cookies.get('auth_token')?.value;
  const userRole = request.cookies.get('user_role')?.value;

  // If accessing a protected route without auth, redirect to login
  if (isProtectedRoute && !authToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing login/register while already authenticated, redirect to dashboard
  if (isPublicRoute && authToken) {
    // Determine the appropriate dashboard based on role
    if (userRole) {
      const roleDashboards: Record<string, string> = {
        'MASTER': '/master/dashboard',
        'SEAFARER': '/seafarer/dashboard',
        'AGENT_ADMIN': '/agent-admin/dashboard',
        'AGENT': '/agent/dashboard',
        'COMPANY_ADMIN': '/company-admin/dashboard',
      };

      const targetDashboard = roleDashboards[userRole.toUpperCase()];
      if (targetDashboard) {
        return NextResponse.redirect(new URL(targetDashboard, request.url));
      }
    }

    // Default redirect for authenticated users without a known role
    return NextResponse.redirect(new URL('/master/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Only run middleware on these paths
  matcher: [
    '/dashboard/:path*',
    '/master/:path*',
    '/agent-admin/:path*',
    '/agent/:path*',
    '/company-admin/:path*',
    '/seafarer/:path*',
    '/seafearer/:path*',
    '/login',
    '/register',
    '/reset-password',
    '/forgot-password',
  ],
};
