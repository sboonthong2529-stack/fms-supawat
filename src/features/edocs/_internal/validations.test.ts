import { describe, it, expect } from "vitest";
import { submitEdocSchema, reviewEdocSchema } from "./validations";

describe("E-Docs Validations", () => {
  it("validates submitEdocSchema with complete requester and document info", () => {
    const valid = {
      requesterName: "กิตติศักดิ์ มั่นคง",
      requesterEmail: "kittisak@example.com",
      requesterPhone: "089-123-4567",
      requesterType: "STUDENT" as const,
      studentOrStaffId: "66012345",
      title: "ขอเปิดรายวิชา CPE301 ในภาคฤดูร้อน",
      details: "เนื่องจากมีนักศึกษาตกค้างจำนวน 15 คน และต้องการลงทะเบียนเรียน",
    };

    const parsed = submitEdocSchema.parse(valid);
    expect(parsed.requesterName).toBe("กิตติศักดิ์ มั่นคง");
    expect(parsed.requesterType).toBe("STUDENT");
    expect(parsed.studentOrStaffId).toBe("66012345");
  });

  it("fails submitEdocSchema when requesterEmail is invalid", () => {
    const invalidEmail = {
      requesterName: "กิตติศักดิ์",
      requesterEmail: "invalid-email",
      title: "หัวข้อ",
      details: "รายละเอียด",
    };

    expect(() => submitEdocSchema.parse(invalidEmail)).toThrow();
  });

  it("validates reviewEdocSchema with action status and comments", () => {
    const review = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      status: "APPROVED" as const,
      reviewerRemarks: "อนุมัติเปิดรายวิชาตามคำร้อง",
    };

    const parsed = reviewEdocSchema.parse(review);
    expect(parsed.id).toBe("123e4567-e89b-12d3-a456-426614174000");
    expect(parsed.status).toBe("APPROVED");
    expect(parsed.reviewerRemarks).toBe("อนุมัติเปิดรายวิชาตามคำร้อง");
  });

  it("fails reviewEdocSchema when id is not a valid uuid", () => {
    const invalidId = {
      id: "abc-123",
      status: "REJECTED" as const,
    };

    expect(() => reviewEdocSchema.parse(invalidId)).toThrow();
  });
});
