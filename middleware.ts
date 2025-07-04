import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const userRole = req.nextauth?.token?.role;

    // Chặn truy cập dashboard admin nếu không phải admin 
    if (pathname.startsWith("/dashboard/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    // Chặn truy cập dashboard user nếu không phải user
    if (pathname.startsWith("/dashboard/user") && userRole !== "user") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    // Chặn truy cập user nếu không phải user
    if (pathname.startsWith("/user") && userRole !== "user") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    // Nếu hợp lệ, cho phép tiếp tục
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        if(!token) {
          return false;
        }
        return true;
      }, // Chỉ cho phép nếu đã đăng nhập
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/admin/:path*",
    "/dashboard/user/:path*",
    "/api/user/:path*",
    "/api/admin/:path*",
  ],
};