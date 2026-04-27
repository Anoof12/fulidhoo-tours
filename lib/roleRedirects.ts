import { hasAdminPanelAccess } from "@/lib/roles";

/** Where to send a user after sign-in based on role (staff vs traveler). */
export function defaultPathForRole(role: string | undefined): string {
  if (hasAdminPanelAccess(role)) {
    return "/admin";
  }
  return "/";
}

/**
 * Prefer NextAuth callbackUrl when present and safe; ensure customers are not sent to /admin.
 */
export function resolvePostLoginRedirect(
  role: string | undefined,
  callbackUrl: string | null,
): string {
  const fallback = defaultPathForRole(role);
  if (!callbackUrl || !callbackUrl.startsWith("/") || callbackUrl.startsWith("//")) {
    return fallback;
  }
  const isStaff = hasAdminPanelAccess(role);
  if (callbackUrl.startsWith("/admin") && !isStaff) {
    return fallback;
  }
  return callbackUrl;
}
