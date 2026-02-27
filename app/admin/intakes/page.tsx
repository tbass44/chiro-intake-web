// app/admin/intakes/page.tsx
// ※ これは Server Component（'use client' は書かない）

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminSessionToken } from "@/lib/adminAuth";
import AdminIntakesClient from "./AdminIntakesClient";

export default async function AdminIntakesPage() {
  const token = cookies().get("admin_session")?.value;
  const secret = process.env.ADMIN_SECRET ?? "";

  // Cookieがなければログインへ
  if (!token) {
    redirect("/admin/login");
  }

  // 署名検証
  const verified = await verifyAdminSessionToken(token, secret);

  // 不正ならログインへ
  if (!verified.ok) {
    redirect("/admin/login");
  }

  // OKなら一覧表示
  return <AdminIntakesClient />;
}
