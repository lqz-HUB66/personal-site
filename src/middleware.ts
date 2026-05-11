import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { JWT_SECRET } from "./lib/config";

const PROTECTED_PREFIXES = [
  "/admin/dashboard",
  "/admin/profile",
  "/admin/honors",
  "/admin/projects",
  "/admin/posts",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect admin pages (not login or API)
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get("admin_token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  try {
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
