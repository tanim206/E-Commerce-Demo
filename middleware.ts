import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Apply only to /dashboard paths
  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const token = await getToken({ req });

  // 1. If no token, redirect to sign-in
  if (!token) {
    const signInUrl = new URL("/api/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // 2. If not accessing /dashboard/user/... => block
  if (!pathname.startsWith("/dashboard/user")) {
    return NextResponse.redirect(new URL("/dashboard/user", req.url));
  }

  // 3. Allow access to /dashboard/user/**
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
