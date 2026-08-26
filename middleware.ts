import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Protect admin dashboard
    if (pathname.startsWith("/admin")) {
      if (token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/browse", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/browse/:path*",
    "/movies/:path*",
    "/series/:path*",
    "/watch/:path*",
    "/my-list/:path*",
    "/profiles/:path*",
    "/account/:path*",
    "/subscription/:path*",
    "/admin/:path*",
  ],
};
