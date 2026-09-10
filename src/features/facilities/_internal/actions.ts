"use server";

import { revalidatePath } from "next/cache";
import { runAction, type ActionResult } from "@/shared/lib/result";
import { getLocale } from "@/shared/lib/i18n/server";
import { zodErrorMap } from "@/shared/lib/i18n/zod-locale";
import { requirePermission } from "@/features/identity/server";
import { prisma } from "@/shared/lib/infra/prisma";
import { FACILITIES_P } from "../permissions";
import {
  createFacilitySchema,
  updateFacilitySchema,
  createBookingSchema,
  reviewBookingSchema,
} from "./validations";
import {
  listFacilities,
  createFacility,
  updateFacility,
  deleteFacility,
  createBooking,
  listBookings,
  reviewBooking,
  type FacilityItemDto,
  type FacilityBookingDto,
} from "./services";

export async function createBookingAction(input: unknown): Promise<ActionResult<FacilityBookingDto>> {
  return runAction(async () => {
    const tenant = await prisma.tenant.findFirst({ where: { isActive: true } });
    if (!tenant) throw new Error("TENANT_NOT_FOUND");

    const parsed = createBookingSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const result = await createBooking(tenant.id, parsed);
    revalidatePath("/facilities");
    revalidatePath("/facilities-admin");
    return result;
  });
}

export async function getAdminFacilitiesAction(options?: {
  type?: string;
  search?: string;
}): Promise<ActionResult<FacilityItemDto[]>> {
  return runAction(async () => {
    const ctx = await requirePermission(FACILITIES_P.facilitiesRead);
    return listFacilities(ctx.tenantId, options);
  });
}

export async function createFacilityAction(input: unknown): Promise<ActionResult<FacilityItemDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(FACILITIES_P.facilitiesManage);
    const parsed = createFacilitySchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const result = await createFacility(ctx.tenantId, parsed);
    revalidatePath("/facilities");
    revalidatePath("/facilities-admin");
    return result;
  });
}

export async function updateFacilityAction(input: unknown): Promise<ActionResult<FacilityItemDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(FACILITIES_P.facilitiesManage);
    const parsed = updateFacilitySchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const result = await updateFacility(ctx.tenantId, parsed);
    revalidatePath("/facilities");
    revalidatePath("/facilities-admin");
    return result;
  });
}

export async function deleteFacilityAction(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(FACILITIES_P.facilitiesManage);
    await deleteFacility(ctx.tenantId, id);
    revalidatePath("/facilities");
    revalidatePath("/facilities-admin");
  });
}

export async function getAdminBookingsAction(options?: {
  facilityId?: string;
  status?: string;
  search?: string;
}): Promise<ActionResult<FacilityBookingDto[]>> {
  return runAction(async () => {
    const ctx = await requirePermission(FACILITIES_P.facilitiesRead);
    return listBookings(ctx.tenantId, options);
  });
}

export async function reviewBookingAction(input: unknown): Promise<ActionResult<FacilityBookingDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(FACILITIES_P.facilitiesManage);
    const parsed = reviewBookingSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const result = await reviewBooking(ctx.tenantId, ctx.userId, parsed);
    revalidatePath("/facilities");
    revalidatePath("/facilities-admin");
    return result;
  });
}
