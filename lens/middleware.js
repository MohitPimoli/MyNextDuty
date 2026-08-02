import { NextResponse } from "next/server";

const ACCESS_TOKEN_KEY = "access_token";

const protectedRoutes = ["/dashboard", "/roadmap", "/profile", "/nearby"];
const guestOnlyRoutes = ["/login", "/register"];

// Public routes — no auth checks, NOT in the matcher:
//   /community     — community page (accessible to all)
//   /mentors       — mentors listing (accessible to all)
//   /mentors/[id]  — mentor profile (accessible to all)
//   /verify-email  — email verification (accessible without login)
//   /forbidden     — 403 error page
//   /server-error  — 500 error page
//   /not-found     — handled by Next.js built-in 404 (not-found.jsx)

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ACCESS_TOKEN_KEY)?.value;

  // Landing page: redirect authenticated users to dashboard
  if (pathname === "/") {
    if (token) {
      const dashboardUrl = new URL("/dashboard", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
    return NextResponse.next();
  }

  // Guest-only routes: redirect authenticated users to dashboard
  if (guestOnlyRoutes.includes(pathname)) {
    if (token) {
      const dashboardUrl = new URL("/dashboard", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
    return NextResponse.next();
  }

  // Protected routes: redirect unauthenticated users to login
  if (protectedRoutes.includes(pathname)) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Only run middleware on routes that need auth checks.
// Public routes (/community, /mentors, /verify-email, /forbidden, /server-error)
// are NOT listed here — they are accessible to all users without middleware.
export const config = {
  matcher: ["/", "/dashboard", "/roadmap", "/profile", "/nearby", "/login", "/register"],
};
