import { prisma } from "@/shared/lib/infra/prisma";
import type { Prisma } from "@/generated/prisma";
import type {
  CreateProgramInput,
  UpdateProgramInput,
  CreateCourseInput,
  UpdateCourseInput,
} from "./validations";

export interface CurriculumCourseDto {
  id: string;
  tenantId: string;
  programId: string;
  courseCode: string;
  nameTh: string;
  nameEn: string;
  credits: number;
  lectureHours: number | null;
  labHours: number | null;
  selfStudyHours: number | null;
  courseCategory: string;
  year: number;
  semester: number;
  descriptionTh: string | null;
  descriptionEn: string | null;
}

export interface CurriculumProgramDto {
  id: string;
  tenantId: string;
  departmentId: string | null;
  departmentCode: string | null;
  departmentNameTh: string | null;
  departmentNameEn: string | null;
  code: string;
  degreeLevel: string;
  nameTh: string;
  nameEn: string;
  degreeNameTh: string;
  degreeNameEn: string;
  totalCredits: number;
  durationYears: number;
  tuitionFeePerTerm: number | null;
  descriptionTh: string;
  descriptionEn: string;
  careerPathsTh: string | null;
  careerPathsEn: string | null;
  curriculumFileUrl: string | null;
  coverImageUrl: string | null;
  orderIndex: number;
  isActive: boolean;
  courseCount?: number;
  courses?: CurriculumCourseDto[];
  createdAt: string;
  updatedAt: string;
}

type ProgramWithDeptAndCourses = Prisma.CurriculumProgramGetPayload<{
  include: {
    department: true;
    courses: true;
  };
}>;

type ProgramWithDeptAndCount = Prisma.CurriculumProgramGetPayload<{
  include: {
    department: true;
    _count: { select: { courses: true } };
  };
}>;

function toProgramDto(row: ProgramWithDeptAndCount): CurriculumProgramDto {
  return {
    id: row.id,
    tenantId: row.tenantId,
    departmentId: row.departmentId,
    departmentCode: row.department?.code ?? null,
    departmentNameTh: row.department?.nameTh ?? null,
    departmentNameEn: row.department?.nameEn ?? null,
    code: row.code,
    degreeLevel: row.degreeLevel,
    nameTh: row.nameTh,
    nameEn: row.nameEn,
    degreeNameTh: row.degreeNameTh,
    degreeNameEn: row.degreeNameEn,
    totalCredits: row.totalCredits,
    durationYears: row.durationYears,
    tuitionFeePerTerm: row.tuitionFeePerTerm,
    descriptionTh: row.descriptionTh,
    descriptionEn: row.descriptionEn,
    careerPathsTh: row.careerPathsTh,
    careerPathsEn: row.careerPathsEn,
    curriculumFileUrl: row.curriculumFileUrl,
    coverImageUrl: row.coverImageUrl,
    orderIndex: row.orderIndex,
    isActive: row.isActive,
    courseCount: row._count?.courses ?? 0,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function toProgramWithCoursesDto(row: ProgramWithDeptAndCourses): CurriculumProgramDto {
  return {
    id: row.id,
    tenantId: row.tenantId,
    departmentId: row.departmentId,
    departmentCode: row.department?.code ?? null,
    departmentNameTh: row.department?.nameTh ?? null,
    departmentNameEn: row.department?.nameEn ?? null,
    code: row.code,
    degreeLevel: row.degreeLevel,
    nameTh: row.nameTh,
    nameEn: row.nameEn,
    degreeNameTh: row.degreeNameTh,
    degreeNameEn: row.degreeNameEn,
    totalCredits: row.totalCredits,
    durationYears: row.durationYears,
    tuitionFeePerTerm: row.tuitionFeePerTerm,
    descriptionTh: row.descriptionTh,
    descriptionEn: row.descriptionEn,
    careerPathsTh: row.careerPathsTh,
    careerPathsEn: row.careerPathsEn,
    curriculumFileUrl: row.curriculumFileUrl,
    coverImageUrl: row.coverImageUrl,
    orderIndex: row.orderIndex,
    isActive: row.isActive,
    courseCount: row.courses.length,
    courses: row.courses.map((c) => ({
      id: c.id,
      tenantId: c.tenantId,
      programId: c.programId,
      courseCode: c.courseCode,
      nameTh: c.nameTh,
      nameEn: c.nameEn,
      credits: c.credits,
      lectureHours: c.lectureHours,
      labHours: c.labHours,
      selfStudyHours: c.selfStudyHours,
      courseCategory: c.courseCategory,
      year: c.year,
      semester: c.semester,
      descriptionTh: c.descriptionTh,
      descriptionEn: c.descriptionEn,
    })),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function listPublicPrograms(
  tenantId: string,
  options?: {
    degreeLevel?: string;
    departmentId?: string;
    search?: string;
  }
): Promise<CurriculumProgramDto[]> {
  const where: Prisma.CurriculumProgramWhereInput = {
    tenantId,
    isActive: true,
  };

  if (options?.degreeLevel && options.degreeLevel !== "ALL") {
    where.degreeLevel = options.degreeLevel;
  }

  if (options?.departmentId && options.departmentId !== "ALL") {
    where.departmentId = options.departmentId;
  }

  if (options?.search) {
    const q = options.search.trim();
    where.OR = [
      { nameTh: { contains: q, mode: "insensitive" } },
      { nameEn: { contains: q, mode: "insensitive" } },
      { code: { contains: q, mode: "insensitive" } },
      { degreeNameTh: { contains: q, mode: "insensitive" } },
      { degreeNameEn: { contains: q, mode: "insensitive" } },
    ];
  }

  const rows = await prisma.curriculumProgram.findMany({
    where,
    include: {
      department: true,
      _count: { select: { courses: true } },
    },
    orderBy: [{ degreeLevel: "asc" }, { orderIndex: "asc" }, { nameTh: "asc" }],
  });

  return rows.map(toProgramDto);
}

export async function getPublicProgramDetail(
  tenantId: string,
  id: string
): Promise<CurriculumProgramDto | null> {
  const row = await prisma.curriculumProgram.findFirst({
    where: {
      tenantId,
      id,
      isActive: true,
    },
    include: {
      department: true,
      courses: {
        orderBy: [{ year: "asc" }, { semester: "asc" }, { courseCode: "asc" }],
      },
    },
  });

  if (!row) return null;
  return toProgramWithCoursesDto(row);
}

export async function listAdminPrograms(
  tenantId: string,
  options?: {
    degreeLevel?: string;
    departmentId?: string;
    search?: string;
  }
): Promise<CurriculumProgramDto[]> {
  const where: Prisma.CurriculumProgramWhereInput = {
    tenantId,
  };

  if (options?.degreeLevel && options.degreeLevel !== "ALL") {
    where.degreeLevel = options.degreeLevel;
  }

  if (options?.departmentId && options.departmentId !== "ALL") {
    where.departmentId = options.departmentId;
  }

  if (options?.search) {
    const q = options.search.trim();
    where.OR = [
      { nameTh: { contains: q, mode: "insensitive" } },
      { nameEn: { contains: q, mode: "insensitive" } },
      { code: { contains: q, mode: "insensitive" } },
      { degreeNameTh: { contains: q, mode: "insensitive" } },
      { degreeNameEn: { contains: q, mode: "insensitive" } },
    ];
  }

  const rows = await prisma.curriculumProgram.findMany({
    where,
    include: {
      department: true,
      _count: { select: { courses: true } },
    },
    orderBy: [{ degreeLevel: "asc" }, { orderIndex: "asc" }, { createdAt: "desc" }],
  });

  return rows.map(toProgramDto);
}

export async function createProgram(
  tenantId: string,
  input: CreateProgramInput
): Promise<CurriculumProgramDto> {
  const created = await prisma.curriculumProgram.create({
    data: {
      tenantId,
      departmentId: input.departmentId || null,
      code: input.code.trim(),
      degreeLevel: input.degreeLevel,
      nameTh: input.nameTh.trim(),
      nameEn: input.nameEn.trim(),
      degreeNameTh: input.degreeNameTh.trim(),
      degreeNameEn: input.degreeNameEn.trim(),
      totalCredits: input.totalCredits,
      durationYears: input.durationYears,
      tuitionFeePerTerm: input.tuitionFeePerTerm ?? null,
      descriptionTh: input.descriptionTh.trim(),
      descriptionEn: input.descriptionEn.trim(),
      careerPathsTh: input.careerPathsTh?.trim() || null,
      careerPathsEn: input.careerPathsEn?.trim() || null,
      curriculumFileUrl: input.curriculumFileUrl?.trim() || null,
      coverImageUrl: input.coverImageUrl?.trim() || null,
      orderIndex: input.orderIndex,
      isActive: input.isActive,
    },
    include: {
      department: true,
      _count: { select: { courses: true } },
    },
  });

  return toProgramDto(created);
}

export async function updateProgram(
  tenantId: string,
  input: UpdateProgramInput
): Promise<CurriculumProgramDto> {
  const existing = await prisma.curriculumProgram.findFirst({
    where: { id: input.id, tenantId },
  });
  if (!existing) {
    throw new Error("PROGRAM_NOT_FOUND");
  }

  const updated = await prisma.curriculumProgram.update({
    where: { id: input.id },
    data: {
      departmentId: input.departmentId || null,
      code: input.code.trim(),
      degreeLevel: input.degreeLevel,
      nameTh: input.nameTh.trim(),
      nameEn: input.nameEn.trim(),
      degreeNameTh: input.degreeNameTh.trim(),
      degreeNameEn: input.degreeNameEn.trim(),
      totalCredits: input.totalCredits,
      durationYears: input.durationYears,
      tuitionFeePerTerm: input.tuitionFeePerTerm ?? null,
      descriptionTh: input.descriptionTh.trim(),
      descriptionEn: input.descriptionEn.trim(),
      careerPathsTh: input.careerPathsTh?.trim() || null,
      careerPathsEn: input.careerPathsEn?.trim() || null,
      curriculumFileUrl: input.curriculumFileUrl?.trim() || null,
      coverImageUrl: input.coverImageUrl?.trim() || null,
      orderIndex: input.orderIndex,
      isActive: input.isActive,
    },
    include: {
      department: true,
      _count: { select: { courses: true } },
    },
  });

  return toProgramDto(updated);
}

export async function deleteProgram(
  tenantId: string,
  id: string
): Promise<{ id: string }> {
  const existing = await prisma.curriculumProgram.findFirst({
    where: { id, tenantId },
  });
  if (!existing) {
    throw new Error("PROGRAM_NOT_FOUND");
  }

  await prisma.curriculumProgram.delete({
    where: { id },
  });

  return { id };
}

export async function createCourse(
  tenantId: string,
  input: CreateCourseInput
): Promise<CurriculumCourseDto> {
  const program = await prisma.curriculumProgram.findFirst({
    where: { id: input.programId, tenantId },
  });
  if (!program) {
    throw new Error("PROGRAM_NOT_FOUND");
  }

  const created = await prisma.curriculumCourse.create({
    data: {
      tenantId,
      programId: input.programId,
      courseCode: input.courseCode.trim(),
      nameTh: input.nameTh.trim(),
      nameEn: input.nameEn.trim(),
      credits: input.credits,
      lectureHours: input.lectureHours ?? null,
      labHours: input.labHours ?? null,
      selfStudyHours: input.selfStudyHours ?? null,
      courseCategory: input.courseCategory,
      year: input.year,
      semester: input.semester,
      descriptionTh: input.descriptionTh?.trim() || null,
      descriptionEn: input.descriptionEn?.trim() || null,
    },
  });

  return {
    id: created.id,
    tenantId: created.tenantId,
    programId: created.programId,
    courseCode: created.courseCode,
    nameTh: created.nameTh,
    nameEn: created.nameEn,
    credits: created.credits,
    lectureHours: created.lectureHours,
    labHours: created.labHours,
    selfStudyHours: created.selfStudyHours,
    courseCategory: created.courseCategory,
    year: created.year,
    semester: created.semester,
    descriptionTh: created.descriptionTh,
    descriptionEn: created.descriptionEn,
  };
}

export async function updateCourse(
  tenantId: string,
  input: UpdateCourseInput
): Promise<CurriculumCourseDto> {
  const existing = await prisma.curriculumCourse.findFirst({
    where: { id: input.id, tenantId },
  });
  if (!existing) {
    throw new Error("COURSE_NOT_FOUND");
  }

  const updated = await prisma.curriculumCourse.update({
    where: { id: input.id },
    data: {
      courseCode: input.courseCode.trim(),
      nameTh: input.nameTh.trim(),
      nameEn: input.nameEn.trim(),
      credits: input.credits,
      lectureHours: input.lectureHours ?? null,
      labHours: input.labHours ?? null,
      selfStudyHours: input.selfStudyHours ?? null,
      courseCategory: input.courseCategory,
      year: input.year,
      semester: input.semester,
      descriptionTh: input.descriptionTh?.trim() || null,
      descriptionEn: input.descriptionEn?.trim() || null,
    },
  });

  return {
    id: updated.id,
    tenantId: updated.tenantId,
    programId: updated.programId,
    courseCode: updated.courseCode,
    nameTh: updated.nameTh,
    nameEn: updated.nameEn,
    credits: updated.credits,
    lectureHours: updated.lectureHours,
    labHours: updated.labHours,
    selfStudyHours: updated.selfStudyHours,
    courseCategory: updated.courseCategory,
    year: updated.year,
    semester: updated.semester,
    descriptionTh: updated.descriptionTh,
    descriptionEn: updated.descriptionEn,
  };
}

export async function deleteCourse(
  tenantId: string,
  id: string
): Promise<{ id: string }> {
  const existing = await prisma.curriculumCourse.findFirst({
    where: { id, tenantId },
  });
  if (!existing) {
    throw new Error("COURSE_NOT_FOUND");
  }

  await prisma.curriculumCourse.delete({
    where: { id },
  });

  return { id };
}
