import { requirePermission, hasPermission } from "@/features/identity/server";
import {
  FACILITIES_P,
  listFacilities,
  listBookings,
} from "@/features/facilities/server";
import { FacilitiesAdminClient } from "./_components/facilities-admin-client";

export default async function FacilitiesAdminPage() {
  const ctx = await requirePermission(FACILITIES_P.facilitiesRead);
  const [facilities, bookings] = await Promise.all([
    listFacilities(ctx.tenantId),
    listBookings(ctx.tenantId),
  ]);

  return (
    <FacilitiesAdminClient
      initialFacilities={facilities}
      initialBookings={bookings}
      canManage={hasPermission(ctx, FACILITIES_P.facilitiesManage)}
    />
  );
}
