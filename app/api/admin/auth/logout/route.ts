import { NextResponse } from "next/server";
import { adminCookies } from "@/lib/admin/auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(adminCookies.session);
  return response;
}
