import { z } from "zod";

export const positionTypeEnum = z.enum(["ACADEMIC", "SUPPORT"]);

export const createDepartmentSchema = z.object({
  code: z.string().min(1, "code_required").max(50),
  nameTh: z.string().min(1, "name_required").max(255),
  nameEn: z.string().min(1, "name_required").max(255),
  orderIndex: z.number().int().default(0),
});

export const updateDepartmentSchema = createDepartmentSchema.extend({
  id: z.string().uuid(),
});

export const createPersonnelSchema = z.object({
  departmentId: z.string().uuid().optional().nullable(),
  academicTitle: z.string().max(50).optional().nullable(),
  firstNameTh: z.string().min(1, "first_name_required").max(100),
  lastNameTh: z.string().min(1, "last_name_required").max(100),
  firstNameEn: z.string().min(1, "first_name_required").max(100),
  lastNameEn: z.string().min(1, "last_name_required").max(100),
  positionType: positionTypeEnum.default("ACADEMIC"),
  executivePositionTh: z.string().max(255).optional().nullable(),
  executivePositionEn: z.string().max(255).optional().nullable(),
  isExecutive: z.boolean().default(false),
  email: z.string().email().or(z.literal("")).optional().nullable(),
  phone: z.string().max(50).optional().nullable(),
  officeRoom: z.string().max(100).optional().nullable(),
  avatarUrl: z.string().max(500).optional().nullable(),
  bioTh: z.string().max(2000).optional().nullable(),
  bioEn: z.string().max(2000).optional().nullable(),
  researchInterests: z.string().max(1000).optional().nullable(),
  orderIndex: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const updatePersonnelSchema = createPersonnelSchema.extend({
  id: z.string().uuid(),
});

export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;
export type CreatePersonnelInput = z.infer<typeof createPersonnelSchema>;
export type UpdatePersonnelInput = z.infer<typeof updatePersonnelSchema>;
export type PositionTypeValue = z.infer<typeof positionTypeEnum>;
