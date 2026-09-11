import type { Metadata } from "next";
import { prisma } from "@/shared/lib/infra/prisma";
import { getT } from "@/i18n/server";
import { listEdocTemplates } from "@/features/edocs/server";
import { RequestsClient } from "./_components/requests-client";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: `${t("edocs.publicTitle")} | Faculty of Technology & Innovation`,
    description: t("edocs.publicSubtitle"),
  };
}

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
