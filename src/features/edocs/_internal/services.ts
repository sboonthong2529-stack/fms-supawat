import { prisma } from "@/shared/lib/infra/prisma";
import type { Prisma } from "@/generated/prisma";
import type { SubmitEdocInput, ReviewEdocInput } from "./validations";

export interface EdocTemplateDto {
  id: string;
  tenantId: string;
  code: string;
  nameTh: string;
  nameEn: string;
  category: string;
  description: string | null;
  isActive: boolean;
  orderIndex: number;
}

export interface EdocRequestDto {
  id: string;
  tenantId: string;
  templateId: string | null;
  templateNameTh: string | null;
  templateNameEn: string | null;
  trackingCode: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string | null;
  requesterType: string;
  studentOrStaffId: string | null;
  title: string;
  details: string;
  attachmentUrl: string | null;
  status: string;
  reviewerRemarks: string | null;
  reviewedById: string | null;
  reviewedByName: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

type EdocRequestWithRelations = Prisma.EdocRequestGetPayload<{
  include: {
    template: true;
    reviewedBy: { select: { name: true } };
  };
}>;

function toEdocDto(row: EdocRequestWithRelations): EdocRequestDto {
  return {
    id: row.id,
    tenantId: row.tenantId,
    templateId: row.templateId,
    templateNameTh: row.template?.nameTh ?? null,
    templateNameEn: row.template?.nameEn ?? null,
    trackingCode: row.trackingCode,
    requesterName: row.requesterName,
    requesterEmail: row.requesterEmail,
    requesterPhone: row.requesterPhone,
    requesterType: row.requesterType,
    studentOrStaffId: row.studentOrStaffId,
    title: row.title,
    details: row.details,
    attachmentUrl: row.attachmentUrl,
    status: row.status,
    reviewerRemarks: row.reviewerRemarks,
    reviewedById: row.reviewedById,
    reviewedByName: row.reviewedBy?.name ?? null,
    reviewedAt: row.reviewedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function listEdocTemplates(tenantId: string): Promise<EdocTemplateDto[]> {
  const rows = await prisma.edocTemplate.findMany({
    where: { tenantId, isActive: true },
    orderBy: [{ orderIndex: "asc" }, { code: "asc" }],
  });

  return rows.map((r) => ({
    id: r.id,
    tenantId: r.tenantId,
    code: r.code,
    nameTh: r.nameTh,
    nameEn: r.nameEn,
    category: r.category,
    description: r.description,
    isActive: r.isActive,
    orderIndex: r.orderIndex,
  }));
}

export async function submitEdocRequest(
  tenantId: string,
  input: SubmitEdocInput
): Promise<EdocRequestDto> {
  const year = new Date().getFullYear();
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const trackingCode = `REQ-${year}-${randomSuffix}`;

  const created = await prisma.edocRequest.create({
    data: {
      tenantId,
      templateId: input.templateId || null,
      trackingCode,
      requesterName: input.requesterName.trim(),
      requesterEmail: input.requesterEmail.trim().toLowerCase(),
      requesterPhone: input.requesterPhone?.trim() || null,
      requesterType: input.requesterType,
      studentOrStaffId: input.studentOrStaffId?.trim() || null,
      title: input.title.trim(),
      details: input.details.trim(),
      attachmentUrl: input.attachmentUrl?.trim() || null,
      status: "SUBMITTED",
    },
    include: {
      template: true,
      reviewedBy: { select: { name: true } },
    },
  });

  return toEdocDto(created);
}

export async function trackEdocRequest(
  tenantId: string,
  trackingCode: string
): Promise<EdocRequestDto | null> {
  const row = await prisma.edocRequest.findFirst({
    where: {
      tenantId,
      trackingCode: trackingCode.trim().toUpperCase(),
    },
    include: {
      template: true,
      reviewedBy: { select: { name: true } },
    },
  });

  if (!row) return null;
  return toEdocDto(row);
}

export async function listAdminEdocRequests(
  tenantId: string,
  filters?: {
    status?: string;
    templateId?: string;
    search?: string;
  }
): Promise<EdocRequestDto[]> {
  const where: Prisma.EdocRequestWhereInput = {
    tenantId,
  };

  if (filters?.status && filters.status !== "ALL") {
    where.status = filters.status;
  }

  if (filters?.templateId && filters.templateId !== "ALL") {
    where.templateId = filters.templateId;
  }

  if (filters?.search) {
    const q = filters.search.trim();
    where.OR = [
      { trackingCode: { contains: q, mode: "insensitive" } },
      { requesterName: { contains: q, mode: "insensitive" } },
      { requesterEmail: { contains: q, mode: "insensitive" } },
      { title: { contains: q, mode: "insensitive" } },
      { studentOrStaffId: { contains: q, mode: "insensitive" } },
    ];
  }

  const rows = await prisma.edocRequest.findMany({
    where,
    include: {
      template: true,
      reviewedBy: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return rows.map(toEdocDto);
}

export async function reviewEdocRequest(
  tenantId: string,
  reviewerId: string,
  input: ReviewEdocInput
): Promise<EdocRequestDto> {
  const existing = await prisma.edocRequest.findFirst({
    where: { id: input.id, tenantId },
  });
  if (!existing) {
    throw new Error("REQUEST_NOT_FOUND");
  }

  const updated = await prisma.edocRequest.update({
    where: { id: input.id },
    data: {
      status: input.status,
      reviewerRemarks: input.reviewerRemarks?.trim() || null,
      reviewedById: reviewerId,
      reviewedAt: new Date(),
    },
    include: {
      template: true,
      reviewedBy: { select: { name: true } },
    },
  });

  return toEdocDto(updated);
}
