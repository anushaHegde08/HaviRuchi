import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: [
    // protect these routes
    "/screens/discover/:path*",
    "/screens/add-recipe/:path*",
    "/screens/favorites/:path*",
    "/screens/profile/:path*",
  ],
};
