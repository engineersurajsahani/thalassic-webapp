import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  let token = request.cookies.get("auth_token")?.value;
  let role = request.cookies.get("user_role")?.value;
  let onboardingStatus = request.cookies.get("onboarding_status")?.value;

  if (pathname.startsWith("/agent-admin")) {
    token = request.cookies.get("auth_token_agent-admin")?.value || token;
    role = request.cookies.get("user_role_agent-admin")?.value || role;
  } else if (pathname.startsWith("/partner") || pathname.startsWith("/agent")) {
    token = request.cookies.get("auth_token_partner")?.value || request.cookies.get("auth_token_agent")?.value || token;
    role = request.cookies.get("user_role_partner")?.value || request.cookies.get("user_role_agent")?.value || role;
    onboardingStatus = request.cookies.get("onboarding_status_partner")?.value || request.cookies.get("onboarding_status_agent")?.value || onboardingStatus;
  } else if (pathname.startsWith("/company-admin")) {
    token = request.cookies.get("auth_token_company-admin")?.value || token;
    role = request.cookies.get("user_role_company-admin")?.value || role;
  } else if (pathname.startsWith("/master")) {
    token = request.cookies.get("auth_token_master")?.value || token;
    role = request.cookies.get("user_role_master")?.value || role;
  } else if (pathname.startsWith("/seafarer") || pathname.startsWith("/seafearer")) {
    token = request.cookies.get("auth_token_seafarer")?.value || token;
    role = request.cookies.get("user_role_seafarer")?.value || role;
  }

  const roleNorm = role?.toLowerCase().replace('_', '-'); // Normalize roles (e.g. company_admin -> company-admin)

  // Auth bypass for login/register pages (already handled by Next.js routing, but good to keep clear)
  if (!token) {
    if (
      pathname.startsWith("/seafearer") ||
      pathname.startsWith("/seafarer") ||
      pathname.startsWith("/master") ||
      pathname.startsWith("/company-admin") ||
      pathname.startsWith("/agent-admin") ||
      pathname.startsWith("/agent") ||
      pathname.startsWith("/partner")
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
  // Intercept partner/agent routes
  else if (pathname.startsWith("/partner") || pathname.startsWith("/agent")) {
    if (roleNorm !== "agent" && roleNorm !== "partner") {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
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
    "/partner/:path*",
  ],
};