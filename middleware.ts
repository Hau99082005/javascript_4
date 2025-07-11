import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function customMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Các route cần xác thực
  // @ts-ignore
  const userRole = req.nextauth?.token?.role;

  if (pathname.startsWith("/dashboard/admin") && userRole !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (pathname.startsWith("/dashboard/user") && userRole !== "user") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (pathname.startsWith("/user") && userRole !== "user") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}

export default withAuth(customMiddleware, {
  callbacks: {
    authorized: ({ token }) => {
      if (!token) {
        return false;
      }
      return true;
    },
  },
});

export const config = {
  matcher: [
    "/dashboard/admin/:path*",
    "/dashboard/user/:path*",
    "/user/:path*"
    // KHÔNG áp dụng cho /api/:path*
  ],
};