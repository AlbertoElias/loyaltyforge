import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookie = request.cookies.get("crossmint-session")?.value;

  if (pathname.startsWith("/console") && cookie == null) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname === "/" && cookie) {
    return NextResponse.redirect(new URL("/console/collections", request.url));
  }

  if (pathname === "/console" && cookie) {
    return NextResponse.redirect(new URL("/console/collections", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/console/:path*"],
};