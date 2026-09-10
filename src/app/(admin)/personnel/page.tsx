import { requirePermission, hasPermission } from "@/features/identity/server";
import {
  PERSONNEL_P,
  listAdminPersonnel,
  listDepartments,
} from "@/features/personnel/server";
import { PersonnelClient } from "./_components/personnel-client";

export default async function PersonnelAdminPage() {
  const ctx = await requirePermission(PERSONNEL_P.personnelRead);
  const [initialPersonnel, initialDepartments] = await Promise.all([
    listAdminPersonnel(ctx.tenantId),
    listDepartments(ctx.tenantId),
  ]);

  return (
    <PersonnelClient
      initialPersonnel={initialPersonnel}
      initialDepartments={initialDepartments}
      canManage={hasPermission(ctx, PERSONNEL_P.personnelManage)}
    />
  );
}
