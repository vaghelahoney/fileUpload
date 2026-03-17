import { NextResponse, type NextRequest } from "next/server";

export function middlewareHandler(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/api")) return NextResponse.next();
  if (path.startsWith("/_next")) return NextResponse.next();
  if (path.startsWith("/assets")) return NextResponse.next();
  if (path.startsWith("/favicon")) return NextResponse.next();
  if (path.startsWith("/images")) return NextResponse.next();
   const pathname = request.nextUrl.pathname;

  // ✅ API routes ko bypass karo
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // example auth check (optional)
  const session = request.cookies.get("session");

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  return NextResponse.next();
  // const sessionCookie = request.cookies.get("better-auth.session_token");
  // const url = request.nextUrl.clone();

  // // Define public routes
  // const publicRoutes = [
  //   "/dashboard",
  //   "/profile",
  //   "/report",
  //   "/jobs",
  //   "/invoices",
  //   "/notifications",
  //   "/support",
  //   "/security",
  // ];

  // const isProtectedRoute = publicRoutes.some((route) =>
  //   path.startsWith(route)
  // );

  // if (!sessionCookie && isProtectedRoute) {
  //   url.pathname = "/";
  //   return NextResponse.redirect(url);
  // }

  // if (sessionCookie && path === "/") {
  //   url.pathname = "/dashboard";
  //   return NextResponse.redirect(url);
  // }

}
export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
// export const config = {
//   matcher: ["/admin/:path*"],
// };