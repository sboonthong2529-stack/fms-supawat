import { describe, it, expect } from "vitest";
import {
  createFacilitySchema,
  updateFacilitySchema,
  createBookingSchema,
  reviewBookingSchema,
} from "./validations";

describe("Facilities Validations", () => {
  it("validates createFacilitySchema with valid properties", () => {
    const facility = {
      code: "ROOM-301",
      nameTh: "ห้องประชุมวิชาการ 301",
      nameEn: "Conference Room 301",
      type: "MEETING_ROOM" as const,
      capacity: 25,
      location: "อาคาร 1 ชั้น 3",
      amenities: "Projector, WiFi, Microphone",
      isActive: true,
    };

    const parsed = createFacilitySchema.parse(facility);
    expect(parsed.code).toBe("ROOM-301");
    expect(parsed.capacity).toBe(25);
    expect(parsed.type).toBe("MEETING_ROOM");
  });

  it("validates updateFacilitySchema requires uuid id", () => {
    const updateValid = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      code: "ROOM-301",
      nameTh: "ห้องประชุม 301",
      nameEn: "Meeting Room 301",
      location: "Floor 3",
    };

    const parsed = updateFacilitySchema.parse(updateValid);
    expect(parsed.id).toBe("123e4567-e89b-12d3-a456-426614174000");
  });

  it("validates createBookingSchema successfully when endTime is after startTime", () => {
    const booking = {
      facilityId: "123e4567-e89b-12d3-a456-426614174000",
      bookerName: "อาจารย์กฤษณะ",
      bookerEmail: "kritsana@faculty.ac.th",
      bookerDept: "ภาควิชาวิศวกรรมคอมพิวเตอร์",
      purpose: "การประชุมคณะกรรมการพัฒนาหลักสูตร",
      startTime: "2026-09-15T09:00:00Z",
      endTime: "2026-09-15T12:00:00Z",
      attendeeCount: 12,
    };

    const parsed = createBookingSchema.parse(booking);
    expect(parsed.bookerName).toBe("อาจารย์กฤษณะ");
    expect(parsed.attendeeCount).toBe(12);
  });

  it("fails createBookingSchema when endTime is before or equal to startTime", () => {
    const invalidTime = {
      facilityId: "123e4567-e89b-12d3-a456-426614174000",
      bookerName: "อาจารย์กฤษณะ",
      bookerEmail: "kritsana@faculty.ac.th",
      purpose: "ประชุม",
      startTime: "2026-09-15T12:00:00Z",
      endTime: "2026-09-15T09:00:00Z",
    };

    expect(() => createBookingSchema.parse(invalidTime)).toThrow();
  });

  it("validates reviewBookingSchema with status and rejection reason", () => {
    const review = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      status: "REJECTED" as const,
      rejectionReason: "ห้องปิดปรับปรุงระบบปรับอากาศ",
    };

    const parsed = reviewBookingSchema.parse(review);
    expect(parsed.id).toBe("123e4567-e89b-12d3-a456-426614174000");
    expect(parsed.status).toBe("REJECTED");
    expect(parsed.rejectionReason).toBe("ห้องปิดปรับปรุงระบบปรับอากาศ");
  });
});
