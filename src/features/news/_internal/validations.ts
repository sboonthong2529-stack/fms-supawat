import { z } from "zod";

export const newsCategoryEnum = z.enum(["ACADEMIC", "ACTIVITY", "GENERAL", "PROCUREMENT"]);
export const newsStatusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const createNewsSchema = z.object({
  titleTh: z.string().min(1, "title_required").max(255),
  titleEn: z.string().min(1, "title_required").max(255),
  slug: z.string().max(255).optional(),
  summaryTh: z.string().max(2000).optional().nullable(),
  summaryEn: z.string().max(2000).optional().nullable(),
  contentTh: z.string().min(1, "content_required"),
  contentEn: z.string().min(1, "content_required"),
  coverImageUrl: z.string().max(500).optional().nullable(),
  category: newsCategoryEnum.default("GENERAL"),
  status: newsStatusEnum.default("DRAFT"),
  isPinned: z.boolean().default(false),
  publishedAt: z.string().datetime().optional().nullable(),
});

export const updateNewsSchema = createNewsSchema.extend({
  id: z.string().uuid(),
});

export type CreateNewsInput = z.infer<typeof createNewsSchema>;
export type UpdateNewsInput = z.infer<typeof updateNewsSchema>;
export type NewsCategoryType = z.infer<typeof newsCategoryEnum>;
export type NewsStatusType = z.infer<typeof newsStatusEnum>;
