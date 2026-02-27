// app/api/admin/login/route.ts
import { NextResponse } from "next/server";
import { createAdminSessionToken } from "@/lib/adminAuth";

export async function POST(req: Request) {
  const { username, password } = await req.json().catch(() => ({}));

  const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "";
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";
  const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "";
  const days = Number(process.env.ADMIN_SESSION_DAYS ?? "7");

  if (!ADMIN_SECRET) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const ok = username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await createAdminSessionToken(
    username,
    ADMIN_SECRET,
    days
  );

  const res = NextResponse.json({ ok: true });

  // httpOnly cookie
  res.cookies.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: days * 24 * 60 * 60,
  });

  return res;
}
