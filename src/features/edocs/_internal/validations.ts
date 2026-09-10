import { z } from "zod";

export const requesterTypeEnum = z.enum(["STUDENT", "FACULTY", "STAFF", "GUEST"]);
export const edocStatusEnum = z.enum(["SUBMITTED", "IN_REVIEW", "APPROVED", "REJECTED", "CANCELLED"]);

export const submitEdocSchema = z.object({
  templateId: z.string().uuid().optional().nullable(),
  requesterName: z.string().min(1, "name_required").max(255),
  requesterEmail: z.string().email("email_invalid").max(255),
  requesterPhone: z.string().max(50).optional().nullable(),
  requesterType: requesterTypeEnum.default("STUDENT"),
  studentOrStaffId: z.string().max(50).optional().nullable(),
  title: z.string().min(1, "title_required").max(255),
  details: z.string().min(1, "details_required"),
  attachmentUrl: z.string().max(500).optional().nullable(),
});

export const reviewEdocSchema = z.object({
  id: z.string().uuid(),
  status: edocStatusEnum,
  reviewerRemarks: z.string().optional().nullable(),
});

export type RequesterType = z.infer<typeof requesterTypeEnum>;
export type EdocStatus = z.infer<typeof edocStatusEnum>;
export type SubmitEdocInput = z.infer<typeof submitEdocSchema>;
export type ReviewEdocInput = z.infer<typeof reviewEdocSchema>;
