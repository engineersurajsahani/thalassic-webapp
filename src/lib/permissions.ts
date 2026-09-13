import { Role } from "../types/auth";

export const ROLE_HIERARCHY: Record<string, number> = {
  MASTER: 5,
  PARTNER_ADMIN: 4,
  AGENT_ADMIN: 4,
  COMPANY_ADMIN: 3,
  PARTNER: 2,
  AGENT: 2,
  SEAFARER: 1,
};

export function hasPermission(
  userRole: Role | undefined | null,
  requiredRole: Role,
): boolean {
  if (!userRole) return false;
  return (ROLE_HIERARCHY[userRole] || 0) >= (ROLE_HIERARCHY[requiredRole] || 0);
}

export function canAccessDashboard(
  userRole: Role | undefined | null,
  targetPath: string,
): boolean {
  if (!userRole) return false;
  if (userRole === "MASTER") return true;

  if (targetPath.startsWith("/master")) return false;
  if (
    (targetPath.startsWith("/agent-admin") ||
      targetPath.startsWith("/partner-admin")) &&
    userRole !== "PARTNER_ADMIN" &&
    userRole !== "AGENT_ADMIN"
  )
    return false;
  if (targetPath.startsWith("/company-admin") && userRole !== "COMPANY_ADMIN")
    return false;
  if (
    (targetPath.startsWith("/agent") || targetPath.startsWith("/partner")) &&
    !targetPath.startsWith("/agent-admin") &&
    !targetPath.startsWith("/partner-admin") &&
    userRole !== "PARTNER" &&
    userRole !== "AGENT"
  )
    return false;
  if (
    (targetPath.startsWith("/seafarer") ||
      targetPath.startsWith("/seafearer")) &&
    userRole !== "SEAFARER"
  )
    return false;

  return true;
}
