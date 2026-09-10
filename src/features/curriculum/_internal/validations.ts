import { z } from "zod";

export const degreeLevelEnum = z.enum(["BACHELOR", "MASTER", "DOCTORAL"]);
export const courseCategoryEnum = z.enum(["GENERAL", "CORE", "MAJOR_ELECTIVE", "FREE_ELECTIVE"]);

export const createProgramSchema = z.object({
  departmentId: z.string().uuid().optional().nullable(),
  code: z.string().min(1, "code_required").max(50),
  degreeLevel: degreeLevelEnum.default("BACHELOR"),
  nameTh: z.string().min(1, "name_required").max(255),
  nameEn: z.string().min(1, "name_required").max(255),
  degreeNameTh: z.string().min(1, "degree_name_required").max(255),
  degreeNameEn: z.string().min(1, "degree_name_required").max(255),
  totalCredits: z.number().int().min(0).default(0),
  durationYears: z.number().int().min(1).max(10).default(4),
  tuitionFeePerTerm: z.number().int().min(0).optional().nullable(),
  descriptionTh: z.string().min(1, "description_required"),
  descriptionEn: z.string().min(1, "description_required"),
  careerPathsTh: z.string().optional().nullable(),
  careerPathsEn: z.string().optional().nullable(),
  curriculumFileUrl: z.string().max(500).optional().nullable(),
  coverImageUrl: z.string().max(500).optional().nullable(),
  orderIndex: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const updateProgramSchema = createProgramSchema.extend({
  id: z.string().uuid(),
});

export const createCourseSchema = z.object({
  programId: z.string().uuid(),
  courseCode: z.string().min(1, "course_code_required").max(20),
  nameTh: z.string().min(1, "course_name_required").max(255),
  nameEn: z.string().min(1, "course_name_required").max(255),
  credits: z.number().int().min(0).default(3),
  lectureHours: z.number().int().min(0).optional().nullable(),
  labHours: z.number().int().min(0).optional().nullable(),
  selfStudyHours: z.number().int().min(0).optional().nullable(),
  courseCategory: courseCategoryEnum.default("CORE"),
  year: z.number().int().min(1).max(8).default(1),
  semester: z.number().int().min(1).max(3).default(1),
  descriptionTh: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
});

export const updateCourseSchema = createCourseSchema.extend({
  id: z.string().uuid(),
});

export type DegreeLevel = z.infer<typeof degreeLevelEnum>;
export type CourseCategory = z.infer<typeof courseCategoryEnum>;
export type CreateProgramInput = z.infer<typeof createProgramSchema>;
export type UpdateProgramInput = z.infer<typeof updateProgramSchema>;
export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
