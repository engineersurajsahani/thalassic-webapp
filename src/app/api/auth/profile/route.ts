import { NextRequest, NextResponse } from "next/server";

// Same mock users — keep in sync with login route
const MOCK_USERS = [
  {
    id: "master-001",
    email: "master@gmail.com",
    name: "Master Admin",
    firstName: "Master",
    lastName: "Admin",
    phone: "+91 9000000000",
    role: "master",
    onboardingStatus: "Active",
  },
];

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.slice(7);
    let payload: { id: string; email: string; role: string };

    try {
      payload = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const user = MOCK_USERS.find((u) => u.id === payload.id && u.email === payload.email);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
