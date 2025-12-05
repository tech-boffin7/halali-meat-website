import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware() {
    // Authenticated and authorized users will reach here.
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAuthenticated = !!token;
        const isAdmin = token?.role === "ADMIN"; // Corrected to uppercase

        if (req.nextUrl.pathname.startsWith("/admin")) {
          return isAuthenticated && isAdmin;
        }

        // For any other matched routes, just ensure they are authenticated.
        return isAuthenticated;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/api/products/:path*", "/api/upload/:path*"], // Protect admin and sensitive API routes
};
