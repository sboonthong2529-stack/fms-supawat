import { describe, it, expect } from "vitest";
import {
  createProgramSchema,
  updateProgramSchema,
  createCourseSchema,
  updateCourseSchema,
} from "./validations";

describe("Curriculum Validations", () => {
  it("validates createProgramSchema with complete program info", () => {
    const program = {
      code: "B.Eng.-CPE",
      degreeLevel: "BACHELOR" as const,
      nameTh: "วิศวกรรมคอมพิวเตอร์",
      nameEn: "Computer Engineering",
      degreeNameTh: "วิศวกรรมศาสตรบัณฑิต",
      degreeNameEn: "Bachelor of Engineering",
      totalCredits: 128,
      durationYears: 4,
      tuitionFeePerTerm: 25000,
      descriptionTh: "มุ่งเน้นการสร้างวิศวกรคอมพิวเตอร์",
      descriptionEn: "Focuses on producing software and hardware engineers",
    };

    const parsed = createProgramSchema.parse(program);
    expect(parsed.code).toBe("B.Eng.-CPE");
    expect(parsed.totalCredits).toBe(128);
    expect(parsed.durationYears).toBe(4);
    expect(parsed.degreeLevel).toBe("BACHELOR");
    expect(parsed.isActive).toBe(true);
  });

  it("fails createProgramSchema when total credits is negative", () => {
    const invalidCredits = {
      code: "B.Eng.-CPE",
      nameTh: "วิศวะ",
      nameEn: "Eng",
      degreeNameTh: "วศ.บ.",
      degreeNameEn: "B.Eng.",
      descriptionTh: "คำอธิบาย",
      descriptionEn: "Desc",
      totalCredits: -5,
    };
    expect(() => createProgramSchema.parse(invalidCredits)).toThrow();
  });

  it("validates createCourseSchema with valid details", () => {
    const course = {
      programId: "123e4567-e89b-12d3-a456-426614174000",
      courseCode: "CPE101",
      nameTh: "การเขียนโปรแกรมคอมพิวเตอร์",
      nameEn: "Computer Programming",
      credits: 3,
      lectureHours: 2,
      labHours: 3,
      courseCategory: "CORE" as const,
      year: 1,
      semester: 1,
    };

    const parsed = createCourseSchema.parse(course);
    expect(parsed.courseCode).toBe("CPE101");
    expect(parsed.credits).toBe(3);
    expect(parsed.courseCategory).toBe("CORE");
  });

  it("validates updateProgramSchema requires valid uuid id", () => {
    const updateValid = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      code: "B.Eng.-CPE",
      nameTh: "วิศวกรรมคอมพิวเตอร์",
      nameEn: "Computer Engineering",
      degreeNameTh: "วศ.บ.",
      degreeNameEn: "B.Eng.",
      descriptionTh: "คำอธิบาย",
      descriptionEn: "Desc",
    };

    const parsed = updateProgramSchema.parse(updateValid);
    expect(parsed.id).toBe("123e4567-e89b-12d3-a456-426614174000");
  });

  it("validates updateCourseSchema requires valid uuid id", () => {
    const updateCourseValid = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      programId: "123e4567-e89b-12d3-a456-426614174000",
      courseCode: "CPE102",
      nameTh: "โครงสร้างข้อมูล",
      nameEn: "Data Structures",
      credits: 3,
    };

    const parsed = updateCourseSchema.parse(updateCourseValid);
    expect(parsed.id).toBe("123e4567-e89b-12d3-a456-426614174000");
    expect(parsed.courseCode).toBe("CPE102");
  });
});
