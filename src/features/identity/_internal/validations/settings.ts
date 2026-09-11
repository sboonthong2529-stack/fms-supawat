import { z } from "zod";
import { PALETTE_IDS } from "@/shared/lib/palette";

export const smtpSettingsSchema = z.object({
  enabled: z.boolean().default(false),
  user: z.string().trim().email().or(z.literal("")).default(""),
  password: z.string().default(""),
  senderName: z.string().trim().max(100).default(""),
  port: z.number().int().default(465),
  secure: z.boolean().default(true),
});

export const testSmtpSchema = z.object({
  user: z.string().trim().email({ message: "invalid_email" }),
  password: z.string().optional().default(""),
  senderName: z.string().trim().max(100).default(""),
  port: z.number().int().default(465),
  secure: z.boolean().default(true),
  targetEmail: z.string().trim().email({ message: "invalid_target_email" }),
});

export const updateSettingsSchema = z.object({
  nameTh: z.string().trim().min(1).max(255),
  nameEn: z.string().trim().min(1).max(255),
  logoUrl: z
    .string()
    .trim()
    .max(500)
    .refine(
      (val) => val === "" || val.startsWith("/") || z.string().url().safeParse(val).success,
      { message: "invalid_url" }
    )
    .default(""),
  palette: z.enum(PALETTE_IDS),
  smtp: smtpSettingsSchema.optional(),
});

export const updateProfileSchema = z.object({ name: z.string().trim().min(1).max(255), locale: z.enum(["th", "en"]) });

export type SmtpSettingsInput = z.infer<typeof smtpSettingsSchema>;
export type TestSmtpInput = z.infer<typeof testSmtpSchema>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
