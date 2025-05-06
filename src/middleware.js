import { NextResponse } from "next/server"

export function middleware(request) {
  // Special handling for /admin/products/add
  if (request.nextUrl.pathname === "/admin/products/add") {
    return NextResponse.next()
  }
}

export const config = {
  matcher: "/admin/products/:path*",
}
