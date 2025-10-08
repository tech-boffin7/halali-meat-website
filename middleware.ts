import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

console.log("Middleware file is being executed (top level)!");

export default withAuth(
  async function middleware(req) {
    console.log("Middleware function is running!");
    // If we reach here, the user is authenticated and authorized (admin role checked by 'authorized' callback)
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        console.log("Middleware: authorized callback running (simplified)");
        console.log("Middleware: token (simplified)", token);
        console.log("Middleware: pathname (simplified)", req.nextUrl.pathname);

        const isAuthenticated = !!token;
        const isAdmin = token?.role === "admin";

        // Protect admin routes
        if (req.nextUrl.pathname.startsWith("/admin")) {
          console.log("Middleware: Checking admin access for", req.nextUrl.pathname);
          console.log("Middleware: isAuthenticated", isAuthenticated, "isAdmin", isAdmin);
          return isAuthenticated && isAdmin;
        }

        // For other protected routes, just check if authenticated
        console.log("Middleware: Checking general access for", req.nextUrl.pathname);
        console.log("Middleware: isAuthenticated", isAuthenticated);
        return isAuthenticated;
      },
    },
    pages: {
      signIn: "/login", // Redirect to custom login page if unauthorized
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/api/products/:path*"], // Protect /admin and /api/products routes
};
