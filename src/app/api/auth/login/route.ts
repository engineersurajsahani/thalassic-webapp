import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPassword = (password || "").trim();

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

    const backendRes = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
    });

    const data = await backendRes.json().catch(() => ({}));
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Login service unavailable";
    return NextResponse.json({ message }, { status: 500 });
  }
}
