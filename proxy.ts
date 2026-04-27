import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { hasAdminPanelAccess, hasCustomerPortalAccess } from "@/lib/roles";

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

function isProtectedPath(pathname: string): boolean {
  return (
    pathname.startsWith("/account") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/logout")
  );
}

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const role = token?.role as string | undefined;

    if (token && (path.startsWith("/login") || path.startsWith("/register"))) {
      const dest = hasAdminPanelAccess(role) ? "/admin" : "/";
      return NextResponse.redirect(new URL(dest, req.url));
    }

    const isAdminRoute = path.startsWith("/admin");
    if (isAdminRoute && role && !hasAdminPanelAccess(role)) {
      return NextResponse.redirect(new URL("/access-denied?area=admin", req.url));
    }

    const isCustomerRoute = path.startsWith("/account");
    if (isCustomerRoute && role && !hasCustomerPortalAccess(role)) {
      return NextResponse.redirect(new URL("/access-denied?area=customer", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        if (isPublicAuthPath(path)) return true;
        if (isProtectedPath(path)) return !!token;
        return true;
      },
    },
  },
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
