import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin-session";

export async function requireAdmin(request) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return {
      admin: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  try {
    const admin = await verifyAdminSession(token);
    return { admin, response: null };
  } catch {
    return {
      admin: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
}