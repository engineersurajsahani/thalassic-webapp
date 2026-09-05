import { NextRequest, NextResponse } from "next/server";

// Mock user store for local development (no backend required)
const MOCK_USERS = [
  {
    id: "master-001",
    email: "master@gmail.com",
    password: "master@12",
    name: "Master Admin",
    firstName: "Master",
    lastName: "Admin",
    phone: "+91 9000000000",
    role: "master",
    onboardingStatus: "Active",
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate a simple mock token (email + role encoded as base64)
    const token = Buffer.from(
      JSON.stringify({ id: user.id, email: user.email, role: user.role })
    ).toString("base64");

    const { password: _, ...safeUser } = user;

    return NextResponse.json({ token, user: safeUser }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}
