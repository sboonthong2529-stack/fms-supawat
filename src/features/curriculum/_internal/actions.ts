"use server";

import { revalidatePath } from "next/cache";
import { runAction, type ActionResult } from "@/shared/lib/result";
import { getLocale } from "@/shared/lib/i18n/server";
import { zodErrorMap } from "@/shared/lib/i18n/zod-locale";
import { requirePermission } from "@/features/identity/server";
import { CURRICULUM_P } from "../permissions";
import {
  createProgramSchema,
  updateProgramSchema,
  createCourseSchema,
} from "./validations";
import {
  createProgram,
  updateProgram,
  deleteProgram,
  listAdminPrograms,
  createCourse,
  deleteCourse,
  type CurriculumProgramDto,
  type CurriculumCourseDto,
} from "./services";

export async function getAdminProgramsAction(filters?: {
  degreeLevel?: string;
  departmentId?: string;
  search?: string;
}): Promise<ActionResult<CurriculumProgramDto[]>> {
  return runAction(async () => {
    const ctx = await requirePermission(CURRICULUM_P.curriculumRead);
    return listAdminPrograms(ctx.tenantId, filters);
  });
}

export async function createProgramAction(input: unknown): Promise<ActionResult<CurriculumProgramDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(CURRICULUM_P.curriculumManage);
    const parsed = createProgramSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const result = await createProgram(ctx.tenantId, parsed);
    revalidatePath("/programs");
    return result;
  });
}

export async function updateProgramAction(input: unknown): Promise<ActionResult<CurriculumProgramDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(CURRICULUM_P.curriculumManage);
    const parsed = updateProgramSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const result = await updateProgram(ctx.tenantId, parsed);
    revalidatePath("/programs");
    return result;
  });
}

export async function deleteProgramAction(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(CURRICULUM_P.curriculumManage);
    await deleteProgram(ctx.tenantId, id);
    revalidatePath("/programs");
  });
}

export async function createCourseAction(input: unknown): Promise<ActionResult<CurriculumCourseDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(CURRICULUM_P.curriculumManage);
    const parsed = createCourseSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const result = await createCourse(ctx.tenantId, parsed);
    revalidatePath(`/programs/${parsed.programId}`);
    return result;
  });
}

export async function deleteCourseAction(id: string, programId: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(CURRICULUM_P.curriculumManage);
    await deleteCourse(ctx.tenantId, id);
    revalidatePath(`/programs/${programId}`);
  });
}
