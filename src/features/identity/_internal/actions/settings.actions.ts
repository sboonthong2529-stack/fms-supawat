"use server";
import { revalidatePath } from "next/cache";
import { runAction, type ActionResult } from "@/shared/lib/result";
import { getLocale } from "@/shared/lib/i18n/server";
import { zodErrorMap } from "@/shared/lib/i18n/zod-locale";
import { P } from "../../permissions";
import { requirePermission } from "../rbac";
import { updateSettingsSchema, testSmtpSchema } from "../validations/settings";
import { getTenantSettings, updateTenantSettings, getTenantSmtpConfig, type TenantSettings } from "../services/tenant.service";
import { verifyAndSendTestMail } from "@/shared/lib/infra/mailer";

import path from "node:path";
import fs from "node:fs";
import { errors } from "@/shared/lib/errors";

export async function getSettingsAction(): Promise<ActionResult<TenantSettings>> {
  return runAction(async () => getTenantSettings((await requirePermission(P.settingsManage)).tenantId));
}

export async function updateSettingsAction(input: unknown): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(P.settingsManage);
    await updateTenantSettings({ tenantId: ctx.tenantId, actorId: ctx.userId, ...updateSettingsSchema.parse(input, { error: zodErrorMap(await getLocale()) }) });
    revalidatePath("/", "layout"); // data-palette บน <html> อ่านใหม่
  });
}

export async function testSmtpAction(input: unknown): Promise<ActionResult<{ success: boolean; error?: string }>> {
  return runAction(async () => {
    const ctx = await requirePermission(P.settingsManage);
    const data = testSmtpSchema.parse(input, { error: zodErrorMap(await getLocale()) });

    let password = data.password;
    if (!password) {
      // ดึงรหัสผ่านที่เคยบันทึกไว้ใน Tenant settings หากไม่ได้กรอกใหม่
      const config = await getTenantSmtpConfig(ctx.tenantId);
      password = config?.pass || "";
    }

    if (!password) {
      throw errors.validation("validation", { password: ["password_required"] });
    }

    const res = await verifyAndSendTestMail({
      host: "smtp.gmail.com",
      port: data.port,
      secure: data.secure,
      user: data.user,
      pass: password,
      senderName: data.senderName,
      targetEmail: data.targetEmail,
    });

    if (!res.success) {
      throw errors.validation(res.error || "smtp_test_failed");
    }

    return { success: true };
  });
}

export async function uploadLogoAction(formData: FormData): Promise<ActionResult<{ url: string }>> {
  return runAction(async () => {
    const ctx = await requirePermission(P.settingsManage);
    const file = formData.get("file");
    if (!file || !(file instanceof File) || file.size === 0) {
      throw errors.validation("validation", { file: ["file_required"] });
    }

    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw errors.validation("validation", { file: ["file_too_large"] });
    }

    const allowed = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
    if (!allowed.includes(file.type)) {
      throw errors.validation("validation", { file: ["invalid_file_type"] });
    }

    const extMap: Record<string, string> = {
      "image/png": "png",
      "image/jpeg": "jpg",
      "image/webp": "webp",
      "image/svg+xml": "svg",
    };
    const ext = extMap[file.type] || "png";
    const filename = `logo-${ctx.tenantId}-${Date.now()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "logos");
    await fs.promises.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.promises.writeFile(filePath, buffer);

    return { url: `/uploads/logos/${filename}` };
  });
}
