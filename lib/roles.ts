// Plain string constants — avoids importing @prisma/client in the Edge runtime (middleware).
export const ADMIN_PANEL_ROLES = ["GUIDE", "STAFF", "TOUR_OPERATOR", "ADMIN"] as const;

export function hasAdminPanelAccess(role: string | undefined): boolean {
  if (!role) return false;
  return (ADMIN_PANEL_ROLES as readonly string[]).includes(role);
}

export function hasCustomerPortalAccess(role: string | undefined): boolean {
  return role === "CUSTOMER";
}
