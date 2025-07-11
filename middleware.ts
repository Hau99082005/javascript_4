import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function customMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const userRole = req.nextauth?.token?.role;

  // Tự động thêm header CORS cho tất cả route /api/*
  if (pathname.startsWith("/api/")) {
    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Origin", "*"); // hoặc thay * bằng domain FE nếu muốn bảo mật hơn
    response.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return response;
  }

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
}

export default withAuth(customMiddleware, {
  callbacks: {
    authorized: ({ token }) => {
      if(!token) {
        return false;
      }
      return true;
    }, // Chỉ cho phép nếu đã đăng nhập
  },
});

export const config = {
  matcher: [
    "/dashboard/admin/:path*",
    "/dashboard/user/:path*",
    "/user/:path*",
    "/api/:path*",
  ],
};