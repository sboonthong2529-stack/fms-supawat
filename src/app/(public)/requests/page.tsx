import { prisma } from "@/shared/lib/infra/prisma";
import { listEdocTemplates } from "@/features/edocs/server";
import { RequestsClient } from "./_components/requests-client";

interface Props {
  searchParams: Promise<{ code?: string }>;
}

export default async function PublicRequestsPage({ searchParams }: Props) {
  const params = await searchParams;
  const initialTrackCode = params.code || "";

  const tenant = await prisma.tenant.findFirst({ where: { isActive: true } });
  const tenantId = tenant?.id ?? "";

  const templates = tenantId ? await listEdocTemplates(tenantId) : [];

  return (
    <RequestsClient
      templates={templates}
      initialTrackCode={initialTrackCode}
    />
  );
}
