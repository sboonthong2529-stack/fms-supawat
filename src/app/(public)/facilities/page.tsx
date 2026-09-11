import type { Metadata } from "next";
import { prisma } from "@/shared/lib/infra/prisma";
import { getT } from "@/i18n/server";
import { listFacilities } from "@/features/facilities/server";
import { FacilitiesClient } from "./_components/facilities-client";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: `${t("facilities.publicTitle")} | Faculty of Technology & Innovation`,
    description: t("facilities.publicSubtitle"),
  };
}

export default async function PublicFacilitiesPage() {
  const tenant = await prisma.tenant.findFirst({ where: { isActive: true } });
  const tenantId = tenant?.id ?? "";

  const facilities = tenantId
    ? await listFacilities(tenantId, { activeOnly: true })
    : [];

  return <FacilitiesClient facilities={facilities} />;
}
