// Using plain string constants here instead of the Prisma Role enum because
// middleware runs on the Edge runtime which can't import Prisma client.
export const ADMIN_PANEL_ROLES = ["GUIDE", "STAFF", "TOUR_OPERATOR", "ADMIN"] as const;

export function hasAdminPanelAccess(role: string | undefined): boolean {
  if (!role) return false;
  return (ADMIN_PANEL_ROLES as readonly string[]).includes(role);
}

export function hasCustomerPortalAccess(role: string | undefined): boolean {
  return role === "CUSTOMER";
}
