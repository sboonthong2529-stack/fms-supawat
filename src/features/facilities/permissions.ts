import type { PermissionDef } from "@/shared/lib/permission-def";

export const FACILITIES_P = {
  facilitiesRead: "facilities:read",
  facilitiesManage: "facilities:manage",
} as const;

export const FACILITIES_PERMISSIONS: readonly PermissionDef[] = [
  { code: FACILITIES_P.facilitiesRead, module: "facilities", action: "read" },
  { code: FACILITIES_P.facilitiesManage, module: "facilities", action: "manage" },
];
