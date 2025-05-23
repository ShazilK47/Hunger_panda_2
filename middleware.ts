import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;

  // Path the user is trying to access
  const pathname = request.nextUrl.pathname;

  // Admin paths that need admin user
  const isAdminPath = pathname.startsWith("/dashboard/admin");
  const isUserPath =
    pathname.startsWith("/dashboard/profile") ||
    pathname.startsWith("/checkout") ||
    pathname === "/cart";

  // Auth paths (login, register) - should redirect logged in users away
  const isAuthPath =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  // Redirect based on auth state and path
  if (isAuthPath) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // For admin routes, check if user is admin
  if (isAdminPath) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (!token?.isAdmin) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  // For user routes, check if user is authenticated
  if (isUserPath) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
    "/cart",
    "/checkout",
    "/orders/:path*",
  ],
};
