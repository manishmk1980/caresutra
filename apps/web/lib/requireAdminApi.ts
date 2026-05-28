import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/adminAuth";

/** Returns 401 response if not authenticated; otherwise null. */
export async function unauthorizedIfNoAdminSession(): Promise<NextResponse | null> {
  const jar = await cookies();
  const ok = await verifyAdminSession(jar.get(ADMIN_SESSION_COOKIE)?.value);
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
