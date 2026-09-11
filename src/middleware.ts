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

  // Immediately redirect any misspelled /seafearer routes to /seafarer
  if (pathname.startsWith('/seafearer')) {
    const correctedPath = pathname.replace(/^\/seafearer/, '/seafarer');
    const url = new URL(correctedPath, request.url);
    url.search = request.nextUrl.search;
    return NextResponse.redirect(url);
  }

  // Check if the route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathname.startsWith(route)
  );

  const isPublicRoute = PUBLIC_ROUTES.some(route =>
    pathname === route || pathname.startsWith(route)
  );

  // Get the auth token and role from cookies
  const authToken = request.cookies.get('auth_token')?.value || request.cookies.get('token')?.value;
  const userRole = request.cookies.get('user_role')?.value?.toUpperCase();

  // If accessing a protected route without auth, redirect to login
  if (isProtectedRoute && !authToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // RBAC route enforcement for authenticated users on protected routes
  if (isProtectedRoute && authToken && userRole) {
    const roleDashboards: Record<string, string> = {
      'MASTER': '/master/dashboard',
      'SEAFARER': '/seafarer/dashboard',
      'AGENT_ADMIN': '/agent-admin/dashboard',
      'AGENT': '/agent/dashboard',
      'COMPANY_ADMIN': '/company-admin/dashboard',
    };

    // Prevent cross-role unauthorized access
    if (pathname.startsWith('/master') && userRole !== 'MASTER') {
      return NextResponse.redirect(new URL(roleDashboards[userRole] || '/login', request.url));
    }
    if (pathname.startsWith('/agent-admin') && userRole !== 'AGENT_ADMIN' && userRole !== 'MASTER') {
      return NextResponse.redirect(new URL(roleDashboards[userRole] || '/login', request.url));
    }
    if (pathname.startsWith('/company-admin') && userRole !== 'COMPANY_ADMIN' && userRole !== 'MASTER') {
      return NextResponse.redirect(new URL(roleDashboards[userRole] || '/login', request.url));
    }
    if (pathname.startsWith('/agent') && !pathname.startsWith('/agent-admin') && userRole !== 'AGENT' && userRole !== 'MASTER') {
      return NextResponse.redirect(new URL(roleDashboards[userRole] || '/login', request.url));
    }
    if (pathname.startsWith('/seafarer') && userRole !== 'SEAFARER' && userRole !== 'MASTER') {
      return NextResponse.redirect(new URL(roleDashboards[userRole] || '/login', request.url));
    }
  }

  // If accessing login/register while already authenticated, redirect to role dashboard
  if ((pathname === '/login' || pathname === '/register') && authToken) {
    if (userRole) {
      const roleDashboards: Record<string, string> = {
        'MASTER': '/master/dashboard',
        'SEAFARER': '/seafarer/dashboard',
        'AGENT_ADMIN': '/agent-admin/dashboard',
        'AGENT': '/agent/dashboard',
        'COMPANY_ADMIN': '/company-admin/dashboard',
      };

      const targetDashboard = roleDashboards[userRole];
      if (targetDashboard) {
        return NextResponse.redirect(new URL(targetDashboard, request.url));
      }
    }

    return NextResponse.redirect(new URL('/master/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
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
