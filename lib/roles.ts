import { Role } from "@prisma/client";

/**
 * Roles allowed to use `/admin` and operator APIs (field guides, office staff, operators, admins).
 * CUSTOMER is excluded.
 */
export const ADMIN_PANEL_ROLES: Role[] = [
  Role.GUIDE,
  Role.STAFF,
  Role.TOUR_OPERATOR,
  Role.ADMIN,
];

export function hasAdminPanelAccess(role: Role | string | undefined): boolean {
  if (!role) return false;
  return ADMIN_PANEL_ROLES.includes(role as Role);
}

export function hasCustomerPortalAccess(role: Role | string | undefined): boolean {
  return role === Role.CUSTOMER;
}
