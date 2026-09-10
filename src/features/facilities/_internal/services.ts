import { prisma } from "@/shared/lib/infra/prisma";
import type { Prisma } from "@/generated/prisma";
import type {
  CreateFacilityInput,
  UpdateFacilityInput,
  CreateBookingInput,
  ReviewBookingInput,
} from "./validations";

export interface FacilityItemDto {
  id: string;
  tenantId: string;
  code: string;
  nameTh: string;
  nameEn: string;
  type: string;
  capacity: number;
  location: string;
  amenities: string | null;
  imageUrl: string | null;
  isActive: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface FacilityBookingDto {
  id: string;
  tenantId: string;
  facilityId: string;
  facilityNameTh: string;
  facilityNameEn: string;
  facilityCode: string;
  facilityType: string;
  facilityLocation: string;
  bookingNumber: string;
  bookerName: string;
  bookerEmail: string;
  bookerPhone: string | null;
  bookerDept: string | null;
  purpose: string;
  startTime: string;
  endTime: string;
  attendeeCount: number;
  status: string;
  rejectionReason: string | null;
  approvedById: string | null;
  approvedByName: string | null;
  createdAt: string;
  updatedAt: string;
}

type BookingWithRelations = Prisma.FacilityBookingGetPayload<{
  include: {
    facility: true;
    approvedBy: { select: { name: true } };
  };
}>;

function toBookingDto(row: BookingWithRelations): FacilityBookingDto {
  return {
    id: row.id,
    tenantId: row.tenantId,
    facilityId: row.facilityId,
    facilityNameTh: row.facility.nameTh,
    facilityNameEn: row.facility.nameEn,
    facilityCode: row.facility.code,
    facilityType: row.facility.type,
    facilityLocation: row.facility.location,
    bookingNumber: row.bookingNumber,
    bookerName: row.bookerName,
    bookerEmail: row.bookerEmail,
    bookerPhone: row.bookerPhone,
    bookerDept: row.bookerDept,
    purpose: row.purpose,
    startTime: row.startTime.toISOString(),
    endTime: row.endTime.toISOString(),
    attendeeCount: row.attendeeCount,
    status: row.status,
    rejectionReason: row.rejectionReason,
    approvedById: row.approvedById,
    approvedByName: row.approvedBy?.name ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function listFacilities(
  tenantId: string,
  options?: {
    type?: string;
    activeOnly?: boolean;
    search?: string;
  }
): Promise<FacilityItemDto[]> {
  const where: Prisma.FacilityItemWhereInput = {
    tenantId,
  };

  if (options?.activeOnly) {
    where.isActive = true;
  }

  if (options?.type && options.type !== "ALL") {
    where.type = options.type;
  }

  if (options?.search) {
    const q = options.search.trim();
    where.OR = [
      { code: { contains: q, mode: "insensitive" } },
      { nameTh: { contains: q, mode: "insensitive" } },
      { nameEn: { contains: q, mode: "insensitive" } },
      { location: { contains: q, mode: "insensitive" } },
    ];
  }

  const rows = await prisma.facilityItem.findMany({
    where,
    orderBy: [{ orderIndex: "asc" }, { code: "asc" }],
  });

  return rows.map((r) => ({
    id: r.id,
    tenantId: r.tenantId,
    code: r.code,
    nameTh: r.nameTh,
    nameEn: r.nameEn,
    type: r.type,
    capacity: r.capacity,
    location: r.location,
    amenities: r.amenities,
    imageUrl: r.imageUrl,
    isActive: r.isActive,
    orderIndex: r.orderIndex,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));
}

export async function createFacility(
  tenantId: string,
  input: CreateFacilityInput
): Promise<FacilityItemDto> {
  const created = await prisma.facilityItem.create({
    data: {
      tenantId,
      code: input.code.trim(),
      nameTh: input.nameTh.trim(),
      nameEn: input.nameEn.trim(),
      type: input.type,
      capacity: input.capacity,
      location: input.location.trim(),
      amenities: input.amenities?.trim() || null,
      imageUrl: input.imageUrl?.trim() || null,
      isActive: input.isActive,
      orderIndex: input.orderIndex,
    },
  });

  return {
    ...created,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
  };
}

export async function updateFacility(
  tenantId: string,
  input: UpdateFacilityInput
): Promise<FacilityItemDto> {
  const existing = await prisma.facilityItem.findFirst({
    where: { id: input.id, tenantId },
  });
  if (!existing) {
    throw new Error("FACILITY_NOT_FOUND");
  }

  const updated = await prisma.facilityItem.update({
    where: { id: input.id },
    data: {
      code: input.code.trim(),
      nameTh: input.nameTh.trim(),
      nameEn: input.nameEn.trim(),
      type: input.type,
      capacity: input.capacity,
      location: input.location.trim(),
      amenities: input.amenities?.trim() || null,
      imageUrl: input.imageUrl?.trim() || null,
      isActive: input.isActive,
      orderIndex: input.orderIndex,
    },
  });

  return {
    ...updated,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  };
}

export async function deleteFacility(
  tenantId: string,
  id: string
): Promise<{ id: string }> {
  const existing = await prisma.facilityItem.findFirst({
    where: { id, tenantId },
  });
  if (!existing) {
    throw new Error("FACILITY_NOT_FOUND");
  }

  await prisma.facilityItem.delete({
    where: { id },
  });

  return { id };
}

export async function createBooking(
  tenantId: string,
  input: CreateBookingInput
): Promise<FacilityBookingDto> {
  const facility = await prisma.facilityItem.findFirst({
    where: { id: input.facilityId, tenantId, isActive: true },
  });
  if (!facility) {
    throw new Error("FACILITY_NOT_FOUND");
  }

  const start = new Date(input.startTime);
  const end = new Date(input.endTime);

  // Check collision with existing APPROVED bookings
  const collision = await prisma.facilityBooking.findFirst({
    where: {
      tenantId,
      facilityId: input.facilityId,
      status: "APPROVED",
      AND: [
        { startTime: { lt: end } },
        { endTime: { gt: start } },
      ],
    },
  });

  if (collision) {
    throw new Error("BOOKING_OVERLAPPED");
  }

  const year = new Date().getFullYear();
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const bookingNumber = `BKG-${year}-${randomSuffix}`;

  const created = await prisma.facilityBooking.create({
    data: {
      tenantId,
      facilityId: input.facilityId,
      bookingNumber,
      bookerName: input.bookerName.trim(),
      bookerEmail: input.bookerEmail.trim().toLowerCase(),
      bookerPhone: input.bookerPhone?.trim() || null,
      bookerDept: input.bookerDept?.trim() || null,
      purpose: input.purpose.trim(),
      startTime: start,
      endTime: end,
      attendeeCount: input.attendeeCount,
      status: "PENDING",
    },
    include: {
      facility: true,
      approvedBy: { select: { name: true } },
    },
  });

  return toBookingDto(created);
}

export async function listBookings(
  tenantId: string,
  options?: {
    facilityId?: string;
    status?: string;
    search?: string;
  }
): Promise<FacilityBookingDto[]> {
  const where: Prisma.FacilityBookingWhereInput = {
    tenantId,
  };

  if (options?.facilityId && options.facilityId !== "ALL") {
    where.facilityId = options.facilityId;
  }

  if (options?.status && options.status !== "ALL") {
    where.status = options.status;
  }

  if (options?.search) {
    const q = options.search.trim();
    where.OR = [
      { bookingNumber: { contains: q, mode: "insensitive" } },
      { bookerName: { contains: q, mode: "insensitive" } },
      { bookerEmail: { contains: q, mode: "insensitive" } },
      { purpose: { contains: q, mode: "insensitive" } },
    ];
  }

  const rows = await prisma.facilityBooking.findMany({
    where,
    include: {
      facility: true,
      approvedBy: { select: { name: true } },
    },
    orderBy: { startTime: "desc" },
  });

  return rows.map(toBookingDto);
}

export async function reviewBooking(
  tenantId: string,
  reviewerId: string,
  input: ReviewBookingInput
): Promise<FacilityBookingDto> {
  const existing = await prisma.facilityBooking.findFirst({
    where: { id: input.id, tenantId },
  });
  if (!existing) {
    throw new Error("BOOKING_NOT_FOUND");
  }

  // If approving, re-check overlap
  if (input.status === "APPROVED") {
    const collision = await prisma.facilityBooking.findFirst({
      where: {
        tenantId,
        facilityId: existing.facilityId,
        id: { not: existing.id },
        status: "APPROVED",
        AND: [
          { startTime: { lt: existing.endTime } },
          { endTime: { gt: existing.startTime } },
        ],
      },
    });
    if (collision) {
      throw new Error("BOOKING_OVERLAPPED");
    }
  }

  const updated = await prisma.facilityBooking.update({
    where: { id: input.id },
    data: {
      status: input.status,
      rejectionReason: input.rejectionReason?.trim() || null,
      approvedById: reviewerId,
    },
    include: {
      facility: true,
      approvedBy: { select: { name: true } },
    },
  });

  return toBookingDto(updated);
}
