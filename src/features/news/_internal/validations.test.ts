import { describe, it, expect } from "vitest";
import { createNewsSchema, updateNewsSchema } from "./validations";

describe("News Validations", () => {
  it("validates createNewsSchema successfully with valid inputs", () => {
    const valid = {
      titleTh: "เปิดรับสมัครนักศึกษาใหม่",
      titleEn: "New Student Admission Open",
      contentTh: "รายละเอียดการรับสมัครปีการศึกษา 2569",
      contentEn: "Details for admission year 2026",
      category: "ACADEMIC" as const,
      status: "PUBLISHED" as const,
      isPinned: true,
    };

    const parsed = createNewsSchema.parse(valid);
    expect(parsed.titleTh).toBe(valid.titleTh);
    expect(parsed.category).toBe("ACADEMIC");
    expect(parsed.status).toBe("PUBLISHED");
    expect(parsed.isPinned).toBe(true);
  });

  it("applies default values for category, status, and isPinned", () => {
    const minimal = {
      titleTh: "หัวข้อข่าว",
      titleEn: "News Title",
      contentTh: "เนื้อหาข่าว",
      contentEn: "News content",
    };

    const parsed = createNewsSchema.parse(minimal);
    expect(parsed.category).toBe("GENERAL");
    expect(parsed.status).toBe("DRAFT");
    expect(parsed.isPinned).toBe(false);
  });

  it("fails validation when titleTh or titleEn is empty", () => {
    const invalid = {
      titleTh: "",
      titleEn: "Valid Title",
      contentTh: "Content",
      contentEn: "Content",
    };

    expect(() => createNewsSchema.parse(invalid)).toThrow();
  });

  it("validates updateNewsSchema requires valid uuid id", () => {
    const updateValid = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      titleTh: "อัปเดตข่าว",
      titleEn: "Updated News",
      contentTh: "เนื้อหาใหม่",
      contentEn: "New Content",
    };

    const parsed = updateNewsSchema.parse(updateValid);
    expect(parsed.id).toBe("123e4567-e89b-12d3-a456-426614174000");

    const updateInvalidId = { ...updateValid, id: "invalid-uuid" };
    expect(() => updateNewsSchema.parse(updateInvalidId)).toThrow();
  });
});
