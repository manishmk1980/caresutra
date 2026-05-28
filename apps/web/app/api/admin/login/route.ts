import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, signAdminSession } from "@/lib/adminAuth";

function safeEqual(a: string | undefined, b: string | undefined): boolean {
  if (a === undefined || b === undefined) return false;
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) {
    const dummy = Buffer.alloc(32, 0);
    timingSafeEqual(dummy, dummy);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export async function POST(request: NextRequest) {
  try {
    const expectedUser = process.env.ADMIN_USERNAME;
    const expectedPass = process.env.ADMIN_PASSWORD;
    const secret = process.env.ADMIN_SESSION_SECRET;

    if (!expectedUser || !expectedPass || !secret || secret.length < 16) {
      return NextResponse.json(
        { success: false, error: "Server authentication is not configured." },
        { status: 500 },
      );
    }

    let body: { username?: string; password?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
    }

    const username = typeof body.username === "string" ? body.username : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!safeEqual(username, expectedUser) || !safeEqual(password, expectedPass)) {
      return NextResponse.json(
        { success: false, error: "Invalid username or password." },
        { status: 401 },
      );
    }

    const token = await signAdminSession(expectedUser);
    const res = NextResponse.json({ success: true });
    const isProd = process.env.NODE_ENV === "production";

    res.cookies.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return res;
  } catch {
    console.error("Admin login error");
    return NextResponse.json({ success: false, error: "Internal server error." }, { status: 500 });
  }
}
