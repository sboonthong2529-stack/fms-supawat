"use server";

import { revalidatePath } from "next/cache";
import { runAction, type ActionResult } from "@/shared/lib/result";
import { getLocale } from "@/shared/lib/i18n/server";
import { zodErrorMap } from "@/shared/lib/i18n/zod-locale";
import { requirePermission } from "@/features/identity/server";
import { prisma } from "@/shared/lib/infra/prisma";
import { EDOCS_P } from "../permissions";
import {
  submitEdocSchema,
  reviewEdocSchema,
} from "./validations";
import {
  submitEdocRequest,
  trackEdocRequest,
  listAdminEdocRequests,
  reviewEdocRequest,
  type EdocRequestDto,
} from "./services";

export async function submitEdocAction(input: unknown): Promise<ActionResult<EdocRequestDto>> {
  return runAction(async () => {
    const tenant = await prisma.tenant.findFirst({ where: { isActive: true } });
    if (!tenant) throw new Error("TENANT_NOT_FOUND");

    const parsed = submitEdocSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const result = await submitEdocRequest(tenant.id, parsed);
    revalidatePath("/requests");
    revalidatePath("/edocs");
    return result;
  });
}

export async function trackEdocAction(trackingCode: string): Promise<ActionResult<EdocRequestDto | null>> {
  return runAction(async () => {
    const tenant = await prisma.tenant.findFirst({ where: { isActive: true } });
    if (!tenant) throw new Error("TENANT_NOT_FOUND");

    return trackEdocRequest(tenant.id, trackingCode);
  });
}

export async function getAdminEdocRequestsAction(filters?: {
  status?: string;
  templateId?: string;
  search?: string;
}): Promise<ActionResult<EdocRequestDto[]>> {
  return runAction(async () => {
    const ctx = await requirePermission(EDOCS_P.edocsRead);
    return listAdminEdocRequests(ctx.tenantId, filters);
  });
}

export async function reviewEdocAction(input: unknown): Promise<ActionResult<EdocRequestDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(EDOCS_P.edocsManage);
    const parsed = reviewEdocSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const result = await reviewEdocRequest(ctx.tenantId, ctx.userId, parsed);
    revalidatePath("/edocs");
    return result;
  });
}
