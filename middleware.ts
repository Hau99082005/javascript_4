import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function customMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Xử lý CORS cho tất cả route /api/*
  if (pathname.startsWith("/api/")) {
    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return response;
  }

  // Chỉ truy cập req.nextauth cho các route cần xác thực (sau khi đã loại trừ /api/*)
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
    "/user/:path*",
    "/api/:path*",
  ],
};