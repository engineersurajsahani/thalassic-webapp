import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;
  const role = request.cookies.get("user_role")?.value;
  const roleNorm = role?.toLowerCase().replace('_', '-'); // Normalize roles (e.g. company_admin -> company-admin)

  // Auth bypass for login/register pages (already handled by Next.js routing, but good to keep clear)
  if (!token) {
    if (
      pathname.startsWith("/seafearer") ||
      pathname.startsWith("/seafarer") ||
      pathname.startsWith("/master") ||
      pathname.startsWith("/company-admin") ||
      pathname.startsWith("/agent-admin") ||
      pathname.startsWith("/agent")
    ) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Intercept seafarer routes
  if (pathname.startsWith("/seafearer") || pathname.startsWith("/seafarer")) {
    if (roleNorm !== "seafarer" && roleNorm !== "seafearer") {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  // Intercept master routes
  else if (pathname.startsWith("/master")) {
    if (roleNorm !== "master") {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  // Intercept company admin routes
  else if (pathname.startsWith("/company-admin")) {
    if (roleNorm !== "company-admin") {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  // Intercept agent admin routes
  else if (pathname.startsWith("/agent-admin")) {
    if (roleNorm !== "agent-admin") {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  // Intercept agent routes
  else if (pathname.startsWith("/agent")) {
    if (roleNorm !== "agent") {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    const onboardingStatus = request.cookies.get("onboarding_status")?.value;
    if (onboardingStatus !== "Active") {
      if (pathname !== "/agent/onboarding") {
        const onboardUrl = new URL("/agent/onboarding", request.url);
        return NextResponse.redirect(onboardUrl);
      }
    } else {
      if (pathname === "/agent/onboarding") {
        const dashboardUrl = new URL("/agent/dashboard", request.url);
        return NextResponse.redirect(dashboardUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/seafearer/:path*",
    "/seafarer/:path*",
    "/master/:path*",
    "/company-admin/:path*",
    "/agent-admin/:path*",
    "/agent/:path*",
  ],
};