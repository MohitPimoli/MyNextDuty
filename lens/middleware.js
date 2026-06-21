import { NextResponse } from "next/server";

const ACCESS_TOKEN_KEY = "access_token";

const protectedRoutes = ["/", "/nearby"];
const guestOnlyRoutes = ["/login"];

// Public routes — intentionally excluded from the matcher below so they
// pass through without any auth checks:
//   /verify-email  — email verification (accessible without login)
//   /forbidden     — 403 error page
//   /server-error  — 500 error page
//   /not-found     — handled by Next.js built-in 404 (not-found.jsx)

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ACCESS_TOKEN_KEY)?.value;

  // Guest-only routes: redirect authenticated users to home
  if (guestOnlyRoutes.includes(pathname)) {
    if (token) {
      const homeUrl = new URL("/", request.url);
      return NextResponse.redirect(homeUrl);
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

// Only run middleware on protected and guest-only routes.
// Public routes (/verify-email, /forbidden, /server-error, not-found) are
// NOT listed here, so Next.js will never invoke the middleware for them —
// they are accessible to all users without authentication.
export const config = {
  matcher: ["/", "/nearby", "/login"],
};
