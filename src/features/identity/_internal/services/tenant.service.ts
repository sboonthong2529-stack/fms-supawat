import { cache } from "react";
import { prisma, type Db } from "@/shared/lib/infra/prisma";
import { DEFAULT_PALETTE, isPalette, type PaletteId } from "@/shared/lib/palette";
import { errors } from "@/shared/lib/errors";
import { encryptSecret, decryptSecret } from "@/shared/lib/security/crypto";
import { writeAudit } from "../audit";
import type { UpdateSettingsInput } from "../validations/settings";

export interface TenantSmtpSettings {
  enabled: boolean;
  user: string;
  hasPassword: boolean;
  senderName: string;
  port: number;
  secure: boolean;
}

export interface TenantSettings {
  code: string;
  nameTh: string;
  nameEn: string;
  logoUrl: string | null;
  palette: PaletteId;
  smtp: TenantSmtpSettings;
}

export interface DecryptedTenantSmtp {
  enabled: boolean;
  user: string;
  pass: string;
  senderName: string;
  port: number;
  secure: boolean;
}

async function readTenantSettings(tenantId: string, db: Db): Promise<TenantSettings> {
  const t = await db.tenant.findUnique({ where: { id: tenantId } });
  if (!t) throw errors.not_found();
  const settingsObj = (t.settings as {
    palette?: unknown;
    smtp?: {
      enabled?: boolean;
      user?: string;
      password?: string;
      senderName?: string;
      port?: number;
      secure?: boolean;
    };
  }) || {};

  const p = settingsObj.palette;
  const rawSmtp = settingsObj.smtp;

  return {
    code: t.code,
    nameTh: t.nameTh,
    nameEn: t.nameEn,
    logoUrl: t.logoUrl,
    palette: isPalette(p) ? p : DEFAULT_PALETTE,
    smtp: {
      enabled: rawSmtp?.enabled ?? false,
      user: rawSmtp?.user ?? "",
      hasPassword: Boolean(rawSmtp?.password),
      senderName: rawSmtp?.senderName ?? "",
      port: rawSmtp?.port ?? 465,
      secure: rawSmtp?.secure ?? true,
    },
  };
}

export async function getTenantSettings(tenantId: string): Promise<TenantSettings> {
  return readTenantSettings(tenantId, prisma);
}

/** เก็บคีย์อื่น ๆ ใน settings JSON ไว้ทั้งหมด — merge เฉพาะ palette และ smtp ที่เปลี่ยน ไม่ทับทั้งก้อน */
export async function updateTenantSettings(input: { tenantId: string; actorId: string } & UpdateSettingsInput): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const before = await readTenantSettings(input.tenantId, tx);
    const t = await tx.tenant.findUniqueOrThrow({ where: { id: input.tenantId }, select: { settings: true } });
    const prevSettings = (t.settings as {
      palette?: unknown;
      smtp?: {
        enabled?: boolean;
        user?: string;
        password?: string;
        senderName?: string;
        port?: number;
        secure?: boolean;
      };
    }) || {};

    let encryptedPassword = prevSettings.smtp?.password || "";
    if (input.smtp?.password) {
      encryptedPassword = encryptSecret(input.smtp.password);
    }

    const updatedSmtp = input.smtp
      ? {
          enabled: input.smtp.enabled,
          user: input.smtp.user,
          password: encryptedPassword,
          senderName: input.smtp.senderName,
          port: input.smtp.port,
          secure: input.smtp.secure,
        }
      : prevSettings.smtp;

    await tx.tenant.update({
      where: { id: input.tenantId },
      data: {
        nameTh: input.nameTh,
        nameEn: input.nameEn,
        logoUrl: input.logoUrl || null,
        settings: {
          ...prevSettings,
          palette: input.palette,
          smtp: updatedSmtp,
        },
      },
    });

    const auditAfter = {
      ...input,
      smtp: input.smtp
        ? {
            ...input.smtp,
            password: input.smtp.password ? "[REDACTED]" : undefined,
          }
        : undefined,
    };

    await writeAudit(
      {
        tenantId: input.tenantId,
        actorId: input.actorId,
        action: "tenant.settings_update",
        entity: "tenant",
        entityId: input.tenantId,
        before,
        after: auditAfter,
      },
      tx
    );
  });
}

export async function getTenantPalette(tenantId: string): Promise<PaletteId> {
  const t = await prisma.tenant.findUnique({ where: { id: tenantId }, select: { settings: true } });
  const p = (t?.settings as { palette?: unknown } | null)?.palette;
  return isPalette(p) ? p : DEFAULT_PALETTE;
}

/** ดึงข้อมูลการตั้งค่า SMTP สำหรับ Mailer (ถอดรหัสผ่านพร้อมใช้งาน) */
export async function getTenantSmtpConfig(tenantId?: string): Promise<DecryptedTenantSmtp | null> {
  const t = tenantId
    ? await prisma.tenant.findUnique({ where: { id: tenantId }, select: { settings: true } })
    : await prisma.tenant.findFirst({ where: { isActive: true }, orderBy: { createdAt: "asc" }, select: { settings: true } });

  const rawSmtp = (t?.settings as {
    smtp?: {
      enabled?: boolean;
      user?: string;
      password?: string;
      senderName?: string;
      port?: number;
      secure?: boolean;
    };
  } | null)?.smtp;

  if (!rawSmtp || !rawSmtp.enabled || !rawSmtp.user) return null;

  return {
    enabled: Boolean(rawSmtp.enabled),
    user: rawSmtp.user,
    pass: decryptSecret(rawSmtp.password || ""),
    senderName: rawSmtp.senderName || "",
    port: rawSmtp.port || 465,
    secure: rawSmtp.secure ?? (rawSmtp.port === 465),
  };
}

async function sessionTenantId(): Promise<string | null> {
  try {
    const { auth } = await import("../auth");
    return (await auth())?.tenantId || null;
  } catch {
    return null;
  }
}

export const resolvePalette = cache(async (): Promise<PaletteId> => {
  try {
    const tenantId = (await sessionTenantId()) || (await prisma.tenant.findFirst({ orderBy: { createdAt: "asc" }, select: { id: true } }))?.id;
    return tenantId ? await getTenantPalette(tenantId) : DEFAULT_PALETTE;
  } catch {
    return DEFAULT_PALETTE;
  }
});

export const resolveTenantSettings = cache(async (): Promise<TenantSettings | null> => {
  try {
    const tenantId = (await sessionTenantId()) || (await prisma.tenant.findFirst({ orderBy: { createdAt: "asc" }, select: { id: true } }))?.id;
    return tenantId ? await getTenantSettings(tenantId) : null;
  } catch {
    return null;
  }
});
