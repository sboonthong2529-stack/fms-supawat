import { z } from "zod";

export const facilityTypeEnum = z.enum(["MEETING_ROOM", "LAB", "AUDITORIUM", "VEHICLE"]);
export const bookingStatusEnum = z.enum(["PENDING", "APPROVED", "REJECTED", "CANCELLED"]);

export const createFacilitySchema = z.object({
  code: z.string().min(1, "code_required").max(50),
  nameTh: z.string().min(1, "name_required").max(255),
  nameEn: z.string().min(1, "name_required").max(255),
  type: facilityTypeEnum.default("MEETING_ROOM"),
  capacity: z.number().int().min(1).default(10),
  location: z.string().min(1, "location_required").max(255),
  amenities: z.string().optional().nullable(),
  imageUrl: z.string().max(500).optional().nullable(),
  isActive: z.boolean().default(true),
  orderIndex: z.number().int().default(0),
});

export const updateFacilitySchema = createFacilitySchema.extend({
  id: z.string().uuid(),
});

export const createBookingSchema = z.object({
  facilityId: z.string().uuid(),
  bookerName: z.string().min(1, "name_required").max(255),
  bookerEmail: z.string().email("email_invalid").max(255),
  bookerPhone: z.string().max(50).optional().nullable(),
  bookerDept: z.string().max(100).optional().nullable(),
  purpose: z.string().min(1, "purpose_required"),
  startTime: z.string().min(1, "start_time_required"),
  endTime: z.string().min(1, "end_time_required"),
  attendeeCount: z.number().int().min(1).default(1),
}).refine(
  (data) => new Date(data.endTime) > new Date(data.startTime),
  { message: "end_time_must_be_after_start_time", path: ["endTime"] }
);

export const reviewBookingSchema = z.object({
  id: z.string().uuid(),
  status: bookingStatusEnum,
  rejectionReason: z.string().optional().nullable(),
});

export type FacilityType = z.infer<typeof facilityTypeEnum>;
export type BookingStatus = z.infer<typeof bookingStatusEnum>;
export type CreateFacilityInput = z.infer<typeof createFacilitySchema>;
export type UpdateFacilityInput = z.infer<typeof updateFacilitySchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type ReviewBookingInput = z.infer<typeof reviewBookingSchema>;
