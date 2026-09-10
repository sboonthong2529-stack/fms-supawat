import type { PermissionDef } from "@/shared/lib/permission-def";

export const EDOCS_P = {
  edocsRead: "edocs:read",
  edocsManage: "edocs:manage",
} as const;

export const EDOCS_PERMISSIONS: readonly PermissionDef[] = [
  { code: EDOCS_P.edocsRead, module: "edocs", action: "read" },
  { code: EDOCS_P.edocsManage, module: "edocs", action: "manage" },
];
