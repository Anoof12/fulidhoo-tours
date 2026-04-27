import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const STAFF_ROLES = new Set(["ADMIN", "TOUR_OPERATOR"]);

function isPublicAuthPath(pathname: string): boolean {
  return (
    pathname === "/login" ||
    pathname.startsWith("/login/") ||
    pathname === "/register" ||
    pathname.startsWith("/register/") ||
    pathname === "/logout" ||
    pathname.startsWith("/logout/")
  );
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const role = token?.role as string | undefined;

    // Signed-in users should not stay on sign-in / sign-up
    if (token && (path.startsWith("/login") || path.startsWith("/register"))) {
      const dest =
        role && STAFF_ROLES.has(role) ? "/admin" : "/";
      return NextResponse.redirect(new URL(dest, req.url));
    }

    const isAdminRoute = path.startsWith("/admin");
    if (isAdminRoute && role && !STAFF_ROLES.has(role)) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        if (isPublicAuthPath(path)) {
          return true;
        }
        return !!token;
      },
    },
  },
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
