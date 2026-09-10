import { prisma } from "@/shared/lib/infra/prisma";
import { listFacilities } from "@/features/facilities/server";
import { FacilitiesClient } from "./_components/facilities-client";

export default async function PublicFacilitiesPage() {
  const tenant = await prisma.tenant.findFirst({ where: { isActive: true } });
  const tenantId = tenant?.id ?? "";

  const facilities = tenantId
    ? await listFacilities(tenantId, { activeOnly: true })
    : [];

  return <FacilitiesClient facilities={facilities} />;
}
