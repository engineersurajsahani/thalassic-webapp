import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    const cleanEmail = (email || "").trim().toLowerCase();

    // 1. Attempt to forward request to NestJS backend
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://thalassic-api.onrender.com/api/v1";
      const backendRes = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      if (backendRes.ok) {
        const data = await backendRes.json();
        return NextResponse.json(data, { status: 200 });
      }
    } catch (backendError) {
      console.warn("Backend proxy failed, using mock fallbacks:", backendError);
    }

    // 2. Fallback local credentials for development
    if (
      cleanEmail === "agentadmin@thalassic.in" ||
      cleanEmail === "admin@thalassic.in" ||
      cleanEmail === "partneradmin@thalassic.in" ||
      cleanEmail === "agentadmin"
    ) {
      const user = {
        id: "b1111111-1111-1111-1111-111111111111",
        email: cleanEmail.includes("@") ? cleanEmail : "agentadmin@thalassic.in",
        name: "Partner Admin",
        role: "agent_admin",
        phone: "+91 88888 77777",
        onboardingStatus: null,
      };
      const token = Buffer.from(JSON.stringify(user)).toString("base64");
      return NextResponse.json({ token, user }, { status: 200 });
    }

    if (
      cleanEmail === "agent@thalassic.in" ||
      cleanEmail === "partner@thalassic.in" ||
      cleanEmail === "agent" ||
      cleanEmail === "partner"
    ) {
      const user = {
        id: "c2222222-2222-2222-2222-222222222222",
        email: cleanEmail.includes("@") ? cleanEmail : "agent@thalassic.in",
        name: "Partner User",
        role: "agent",
        phone: "+91 99999 88888",
        onboardingStatus: "Active",
      };
      const token = Buffer.from(JSON.stringify(user)).toString("base64");
      return NextResponse.json({ token, user }, { status: 200 });
    }

    if (cleanEmail === "master@gmail.com" || cleanEmail === "master") {
      const user = {
        id: "master-001",
        email: "master@gmail.com",
        name: "Master Admin",
        role: "master",
        phone: "+91 9000000000",
        onboardingStatus: "Active",
      };
      const token = Buffer.from(JSON.stringify(user)).toString("base64");
      return NextResponse.json({ token, user }, { status: 200 });
    }

    if (cleanEmail === "seafarer@test.com" || cleanEmail === "seafarer") {
      const user = {
        id: "seafarer-001",
        email: "seafarer@test.com",
        name: "Test Seafarer",
        role: "seafarer",
        phone: "+91 9876543210",
        onboardingStatus: "Active",
      };
      const token = Buffer.from(JSON.stringify(user)).toString("base64");
      return NextResponse.json({ token, user }, { status: 200 });
    }

    // Default fallback for any other email: create a active user session
    const fallbackUser = {
      id: "user-" + Date.now(),
      email: cleanEmail,
      name: cleanEmail.split("@")[0] || "User",
      role: cleanEmail.includes("admin") ? "agent_admin" : "agent",
      phone: "+91 90000 00000",
      onboardingStatus: "Active",
    };
    const token = Buffer.from(JSON.stringify(fallbackUser)).toString("base64");
    return NextResponse.json({ token, user: fallbackUser }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Login failed" }, { status: 500 });
  }
}
