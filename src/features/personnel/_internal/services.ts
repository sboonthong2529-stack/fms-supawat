import { prisma } from "@/shared/lib/infra/prisma";
import type { Prisma } from "@/generated/prisma";
import type {
  CreateDepartmentInput,
  UpdateDepartmentInput,
  CreatePersonnelInput,
  UpdatePersonnelInput,
} from "./validations";

export interface AcademicDepartmentDto {
  id: string;
  tenantId: string;
  code: string;
  nameTh: string;
  nameEn: string;
  orderIndex: number;
  personnelCount?: number;
}

export interface PersonnelProfileDto {
  id: string;
  tenantId: string;
  departmentId: string | null;
  departmentCode: string | null;
  departmentNameTh: string | null;
  departmentNameEn: string | null;
  academicTitle: string | null;
  firstNameTh: string;
  lastNameTh: string;
  firstNameEn: string;
  lastNameEn: string;
  fullNameTh: string;
  fullNameEn: string;
  positionType: "ACADEMIC" | "SUPPORT";
  executivePositionTh: string | null;
  executivePositionEn: string | null;
  isExecutive: boolean;
  email: string | null;
  phone: string | null;
  officeRoom: string | null;
  avatarUrl: string | null;
  bioTh: string | null;
  bioEn: string | null;
  researchInterests: string | null;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

type PersonnelWithDept = Prisma.PersonnelProfileGetPayload<{
  include: { department: true };
}>;

function toPersonnelDto(row: PersonnelWithDept): PersonnelProfileDto {
  const titlePrefix = row.academicTitle ? `${row.academicTitle} ` : "";
  const fullNameTh = `${titlePrefix}${row.firstNameTh} ${row.lastNameTh}`.trim();
  const fullNameEn = `${row.firstNameEn} ${row.lastNameEn}`.trim();

  return {
    id: row.id,
    tenantId: row.tenantId,
    departmentId: row.departmentId,
    departmentCode: row.department?.code ?? null,
    departmentNameTh: row.department?.nameTh ?? null,
    departmentNameEn: row.department?.nameEn ?? null,
    academicTitle: row.academicTitle,
    firstNameTh: row.firstNameTh,
    lastNameTh: row.lastNameTh,
    firstNameEn: row.firstNameEn,
    lastNameEn: row.lastNameEn,
    fullNameTh,
    fullNameEn,
    positionType: row.positionType as PersonnelProfileDto["positionType"],
    executivePositionTh: row.executivePositionTh,
    executivePositionEn: row.executivePositionEn,
    isExecutive: row.isExecutive,
    email: row.email,
    phone: row.phone,
    officeRoom: row.officeRoom,
    avatarUrl: row.avatarUrl,
    bioTh: row.bioTh,
    bioEn: row.bioEn,
    researchInterests: row.researchInterests,
    orderIndex: row.orderIndex,
    isActive: row.isActive,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

// ── Department Services ──────────────────────────────────────────────────
export async function listDepartments(tenantId: string): Promise<AcademicDepartmentDto[]> {
  const depts = await prisma.academicDepartment.findMany({
    where: { tenantId },
    include: { _count: { select: { personnelProfiles: true } } },
    orderBy: { orderIndex: "asc" },
  });

  return depts.map((d) => ({
    id: d.id,
    tenantId: d.tenantId,
    code: d.code,
    nameTh: d.nameTh,
    nameEn: d.nameEn,
    orderIndex: d.orderIndex,
    personnelCount: d._count.personnelProfiles,
  }));
}

export async function createDepartment(
  tenantId: string,
  input: CreateDepartmentInput
): Promise<AcademicDepartmentDto> {
  const created = await prisma.academicDepartment.create({
    data: {
      tenantId,
      code: input.code.trim().toUpperCase(),
      nameTh: input.nameTh.trim(),
      nameEn: input.nameEn.trim(),
      orderIndex: input.orderIndex,
    },
  });

  return {
    id: created.id,
    tenantId: created.tenantId,
    code: created.code,
    nameTh: created.nameTh,
    nameEn: created.nameEn,
    orderIndex: created.orderIndex,
  };
}

export async function updateDepartment(
  tenantId: string,
  input: UpdateDepartmentInput
): Promise<AcademicDepartmentDto> {
  const updated = await prisma.academicDepartment.update({
    where: { id: input.id, tenantId },
    data: {
      code: input.code.trim().toUpperCase(),
      nameTh: input.nameTh.trim(),
      nameEn: input.nameEn.trim(),
      orderIndex: input.orderIndex,
    },
  });

  return {
    id: updated.id,
    tenantId: updated.tenantId,
    code: updated.code,
    nameTh: updated.nameTh,
    nameEn: updated.nameEn,
    orderIndex: updated.orderIndex,
  };
}

export async function deleteDepartment(tenantId: string, id: string): Promise<void> {
  await prisma.academicDepartment.delete({
    where: { id, tenantId },
  });
}

// ── Personnel Services ──────────────────────────────────────────────────
export async function listPublicExecutives(tenantId: string): Promise<PersonnelProfileDto[]> {
  const executives = await prisma.personnelProfile.findMany({
    where: {
      tenantId,
      isExecutive: true,
      isActive: true,
    },
    include: { department: true },
    orderBy: { orderIndex: "asc" },
  });

  return executives.map(toPersonnelDto);
}

export async function listPublicPersonnel(
  tenantId: string,
  filters?: { departmentId?: string; search?: string }
): Promise<PersonnelProfileDto[]> {
  const where: Prisma.PersonnelProfileWhereInput = {
    tenantId,
    isActive: true,
  };

  if (filters?.departmentId && filters.departmentId !== "ALL") {
    where.departmentId = filters.departmentId;
  }

  if (filters?.search && filters.search.trim()) {
    const q = filters.search.trim();
    where.OR = [
      { firstNameTh: { contains: q, mode: "insensitive" } },
      { lastNameTh: { contains: q, mode: "insensitive" } },
      { firstNameEn: { contains: q, mode: "insensitive" } },
      { lastNameEn: { contains: q, mode: "insensitive" } },
      { researchInterests: { contains: q, mode: "insensitive" } },
    ];
  }

  const list = await prisma.personnelProfile.findMany({
    where,
    include: { department: true },
    orderBy: [{ orderIndex: "asc" }, { createdAt: "desc" }],
  });

  return list.map(toPersonnelDto);
}

export async function listAdminPersonnel(
  tenantId: string,
  filters?: { departmentId?: string; positionType?: string; search?: string }
): Promise<PersonnelProfileDto[]> {
  const where: Prisma.PersonnelProfileWhereInput = { tenantId };

  if (filters?.departmentId && filters.departmentId !== "ALL") {
    where.departmentId = filters.departmentId;
  }

  if (filters?.positionType && filters.positionType !== "ALL") {
    where.positionType = filters.positionType;
  }

  if (filters?.search && filters.search.trim()) {
    const q = filters.search.trim();
    where.OR = [
      { firstNameTh: { contains: q, mode: "insensitive" } },
      { lastNameTh: { contains: q, mode: "insensitive" } },
      { firstNameEn: { contains: q, mode: "insensitive" } },
      { lastNameEn: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }

  const list = await prisma.personnelProfile.findMany({
    where,
    include: { department: true },
    orderBy: [{ isExecutive: "desc" }, { orderIndex: "asc" }, { createdAt: "desc" }],
  });

  return list.map(toPersonnelDto);
}

export async function createPersonnel(
  tenantId: string,
  input: CreatePersonnelInput
): Promise<PersonnelProfileDto> {
  const created = await prisma.personnelProfile.create({
    data: {
      tenantId,
      departmentId: input.departmentId || null,
      academicTitle: input.academicTitle?.trim() || null,
      firstNameTh: input.firstNameTh.trim(),
      lastNameTh: input.lastNameTh.trim(),
      firstNameEn: input.firstNameEn.trim(),
      lastNameEn: input.lastNameEn.trim(),
      positionType: input.positionType,
      executivePositionTh: input.executivePositionTh?.trim() || null,
      executivePositionEn: input.executivePositionEn?.trim() || null,
      isExecutive: input.isExecutive,
      email: input.email?.trim() || null,
      phone: input.phone?.trim() || null,
      officeRoom: input.officeRoom?.trim() || null,
      avatarUrl: input.avatarUrl?.trim() || null,
      bioTh: input.bioTh?.trim() || null,
      bioEn: input.bioEn?.trim() || null,
      researchInterests: input.researchInterests?.trim() || null,
      orderIndex: input.orderIndex,
      isActive: input.isActive,
    },
    include: { department: true },
  });

  return toPersonnelDto(created);
}

export async function updatePersonnel(
  tenantId: string,
  input: UpdatePersonnelInput
): Promise<PersonnelProfileDto> {
  const updated = await prisma.personnelProfile.update({
    where: { id: input.id, tenantId },
    data: {
      departmentId: input.departmentId || null,
      academicTitle: input.academicTitle?.trim() || null,
      firstNameTh: input.firstNameTh.trim(),
      lastNameTh: input.lastNameTh.trim(),
      firstNameEn: input.firstNameEn.trim(),
      lastNameEn: input.lastNameEn.trim(),
      positionType: input.positionType,
      executivePositionTh: input.executivePositionTh?.trim() || null,
      executivePositionEn: input.executivePositionEn?.trim() || null,
      isExecutive: input.isExecutive,
      email: input.email?.trim() || null,
      phone: input.phone?.trim() || null,
      officeRoom: input.officeRoom?.trim() || null,
      avatarUrl: input.avatarUrl?.trim() || null,
      bioTh: input.bioTh?.trim() || null,
      bioEn: input.bioEn?.trim() || null,
      researchInterests: input.researchInterests?.trim() || null,
      orderIndex: input.orderIndex,
      isActive: input.isActive,
    },
    include: { department: true },
  });

  return toPersonnelDto(updated);
}

export async function deletePersonnel(tenantId: string, id: string): Promise<void> {
  await prisma.personnelProfile.delete({
    where: { id, tenantId },
  });
}
