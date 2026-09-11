import { describe, it, expect } from "vitest";
import {
  createDepartmentSchema,
  updateDepartmentSchema,
  createPersonnelSchema,
  updatePersonnelSchema,
} from "./validations";

describe("Personnel Validations", () => {
  it("validates createDepartmentSchema with valid inputs", () => {
    const dept = {
      code: "CPE",
      nameTh: "ภาควิชาวิศวกรรมคอมพิวเตอร์",
      nameEn: "Department of Computer Engineering",
      orderIndex: 1,
    };
    const parsed = createDepartmentSchema.parse(dept);
    expect(parsed.code).toBe("CPE");
    expect(parsed.orderIndex).toBe(1);
  });

  it("validates updateDepartmentSchema requires uuid", () => {
    const updateValid = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      code: "CPE",
      nameTh: "วิศวกรรมคอมพิวเตอร์",
      nameEn: "Department of Computer Engineering",
    };
    const parsed = updateDepartmentSchema.parse(updateValid);
    expect(parsed.id).toBe("123e4567-e89b-12d3-a456-426614174000");
  });

  it("fails createDepartmentSchema when code or name is missing", () => {
    expect(() =>
      createDepartmentSchema.parse({ code: "", nameTh: "วิศวะ", nameEn: "Eng" })
    ).toThrow();
  });

  it("validates createPersonnelSchema with complete details", () => {
    const person = {
      firstNameTh: "สมชาย",
      lastNameTh: "ใจดี",
      firstNameEn: "Somchai",
      lastNameEn: "Jaidee",
      academicTitle: "ผศ.ดร.",
      positionType: "ACADEMIC" as const,
      isExecutive: true,
      executivePositionTh: "รองคณบดีฝ่ายวิชาการ",
      email: "somchai@faculty.ac.th",
    };

    const parsed = createPersonnelSchema.parse(person);
    expect(parsed.firstNameTh).toBe("สมชาย");
    expect(parsed.isExecutive).toBe(true);
    expect(parsed.isActive).toBe(true);
    expect(parsed.positionType).toBe("ACADEMIC");
  });

  it("validates email formatting in createPersonnelSchema", () => {
    const invalidEmail = {
      firstNameTh: "สมชาย",
      lastNameTh: "ใจดี",
      firstNameEn: "Somchai",
      lastNameEn: "Jaidee",
      email: "not-an-email",
    };

    expect(() => createPersonnelSchema.parse(invalidEmail)).toThrow();
  });

  it("validates updatePersonnelSchema requires uuid", () => {
    const updateValid = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      firstNameTh: "สมชาย",
      lastNameTh: "ใจดี",
      firstNameEn: "Somchai",
      lastNameEn: "Jaidee",
    };

    const parsed = updatePersonnelSchema.parse(updateValid);
    expect(parsed.id).toBe("123e4567-e89b-12d3-a456-426614174000");
  });
});
