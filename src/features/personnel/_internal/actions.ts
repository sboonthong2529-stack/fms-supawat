"use server";

import { revalidatePath } from "next/cache";
import { runAction, type ActionResult } from "@/shared/lib/result";
import { getLocale } from "@/shared/lib/i18n/server";
import { zodErrorMap } from "@/shared/lib/i18n/zod-locale";
import { requirePermission } from "@/features/identity/server";
import { PERSONNEL_P } from "../permissions";
import {
  createPersonnelSchema,
  updatePersonnelSchema,
  createDepartmentSchema,
  updateDepartmentSchema,
} from "./validations";
import {
  createPersonnel,
  updatePersonnel,
  deletePersonnel,
  listAdminPersonnel,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  listDepartments,
  type PersonnelProfileDto,
  type AcademicDepartmentDto,
} from "./services";

export async function getAdminPersonnelAction(filters?: {
  departmentId?: string;
  positionType?: string;
  search?: string;
}): Promise<ActionResult<PersonnelProfileDto[]>> {
  return runAction(async () => {
    const ctx = await requirePermission(PERSONNEL_P.personnelRead);
    return listAdminPersonnel(ctx.tenantId, filters);
  });
}

export async function createPersonnelAction(input: unknown): Promise<ActionResult<PersonnelProfileDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(PERSONNEL_P.personnelManage);
    const parsed = createPersonnelSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const result = await createPersonnel(ctx.tenantId, parsed);
    revalidatePath("/personnel");
    revalidatePath("/staff");
    return result;
  });
}

export async function updatePersonnelAction(input: unknown): Promise<ActionResult<PersonnelProfileDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(PERSONNEL_P.personnelManage);
    const parsed = updatePersonnelSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const result = await updatePersonnel(ctx.tenantId, parsed);
    revalidatePath("/personnel");
    revalidatePath("/staff");
    return result;
  });
}

export async function deletePersonnelAction(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(PERSONNEL_P.personnelManage);
    await deletePersonnel(ctx.tenantId, id);
    revalidatePath("/personnel");
    revalidatePath("/staff");
  });
}

// ── Department Actions ──────────────────────────────────────────────────
export async function getDepartmentsAction(): Promise<ActionResult<AcademicDepartmentDto[]>> {
  return runAction(async () => {
    const ctx = await requirePermission(PERSONNEL_P.personnelRead);
    return listDepartments(ctx.tenantId);
  });
}

export async function createDepartmentAction(input: unknown): Promise<ActionResult<AcademicDepartmentDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(PERSONNEL_P.personnelManage);
    const parsed = createDepartmentSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const result = await createDepartment(ctx.tenantId, parsed);
    revalidatePath("/personnel");
    revalidatePath("/staff");
    return result;
  });
}

export async function updateDepartmentAction(input: unknown): Promise<ActionResult<AcademicDepartmentDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(PERSONNEL_P.personnelManage);
    const parsed = updateDepartmentSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const result = await updateDepartment(ctx.tenantId, parsed);
    revalidatePath("/personnel");
    revalidatePath("/staff");
    return result;
  });
}

export async function deleteDepartmentAction(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(PERSONNEL_P.personnelManage);
    await deleteDepartment(ctx.tenantId, id);
    revalidatePath("/personnel");
    revalidatePath("/staff");
  });
}
