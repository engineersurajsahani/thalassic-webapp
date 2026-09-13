import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let apiUrl =
      process.env.NEXT_PUBLIC_API_URL?.trim() ||
      (process.env.NODE_ENV === "production"
        ? "https://thalassic-api.onrender.com/api/v1"
        : "http://localhost:4000/api/v1");

    apiUrl = apiUrl.replace(/\/+$/, "");
    if (!apiUrl.endsWith("/api/v1")) {
      if (apiUrl.endsWith("/api")) {
        apiUrl = `${apiUrl}/v1`;
      } else {
        apiUrl = `${apiUrl}/api/v1`;
      }
    }

    const backendRes = await fetch(`${apiUrl}/auth/profile`, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    });

    const data = await backendRes.json().catch(() => ({}));
    return NextResponse.json(data, { status: backendRes.status });
  } catch {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
