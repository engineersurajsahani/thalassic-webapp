import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.slice(7);
    if (token === "mock-agent-token") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let payload: Record<string, any>;
    try {
      payload = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    if (!payload || !payload.id || !payload.role) {
      return NextResponse.json({ message: "Invalid token payload" }, { status: 401 });
    }

    return NextResponse.json(payload, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
