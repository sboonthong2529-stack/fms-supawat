import { requirePermission, hasPermission } from "@/features/identity/server";
import {
  EDOCS_P,
  listAdminEdocRequests,
  listEdocTemplates,
} from "@/features/edocs/server";
import { EdocsClient } from "./_components/edocs-client";

export default async function EdocsAdminPage() {
  const ctx = await requirePermission(EDOCS_P.edocsRead);
  const [initialRequests, templates] = await Promise.all([
    listAdminEdocRequests(ctx.tenantId),
    listEdocTemplates(ctx.tenantId),
  ]);

  return (
    <EdocsClient
      initialRequests={initialRequests}
      templates={templates}
      canManage={hasPermission(ctx, EDOCS_P.edocsManage)}
    />
  );
}
