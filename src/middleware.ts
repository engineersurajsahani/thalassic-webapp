import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Intercept seafarer routes
  if (pathname.startsWith("/seafearer") || pathname.startsWith("/seafarer")) {
    const token = request.cookies.get("auth_token")?.value;
    const role = request.cookies.get("user_role")?.value;

    const roleNorm = role?.toLowerCase();
    if (!token || (roleNorm !== "seafarer" && roleNorm !== "seafearer")) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/seafearer/:path*", "/seafarer/:path*"],
};