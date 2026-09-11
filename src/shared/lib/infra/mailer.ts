import "server-only";
import nodemailer from "nodemailer";
import { env, smtpConfigured } from "./env";
import { logger } from "./logger";
import { prisma } from "./prisma";
import { decryptSecret } from "../security/crypto";

export interface SmtpConfig {
  host: string;
  port: number;
  secure?: boolean;
  auth?: { user: string; pass: string };
  from?: string;
}

export interface MailInput {
  to: string;
  subject: string;
  text: string;
  html?: string;
  smtp?: SmtpConfig;
}

/**
 * ส่งอีเมลของระบบ
 * 1. ใช้ค่า config เฉพาะเจาะจงที่ส่งเข้ามาใน input (ถ้ามี)
 * 2. ตรวจสอบการตั้งค่า Gmail SMTP ในระดับ Tenant (ถ้าเปิดใช้งาน)
 * 3. หากไม่ได้ตั้งค่า ให้ Fallback ไปยัง Environment Variables (SMTP_HOST)
 * 4. หากไม่มีทั้งสอง ให้บันทึก log ระดับ info โดยไม่ throw เพื่อป้องกันระบบล้มเหลว
 */
export async function sendMail(input: MailInput): Promise<{ delivered: boolean }> {
  // 1. Explicit SMTP config
  if (input.smtp) {
    try {
      const transport = nodemailer.createTransport({
        host: input.smtp.host,
        port: input.smtp.port,
        secure: input.smtp.secure ?? (input.smtp.port === 465),
        auth: input.smtp.auth,
      });
      await transport.sendMail({
        from: input.smtp.from || input.smtp.auth?.user || env().SMTP_FROM,
        to: input.to,
        subject: input.subject,
        text: input.text,
        html: input.html,
      });
      return { delivered: true };
    } catch (err) {
      logger.error("mail send failed (explicit smtp)", { to: input.to, err: err instanceof Error ? err.message : String(err) });
      return { delivered: false };
    }
  }

  // 2. Tenant DB SMTP config
  try {
    const tenant = await prisma.tenant.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
      select: { settings: true },
    });

    const rawSmtp = (tenant?.settings as {
      smtp?: {
        enabled?: boolean;
        user?: string;
        password?: string;
        senderName?: string;
        port?: number;
        secure?: boolean;
      };
    } | null)?.smtp;

    if (rawSmtp?.enabled && rawSmtp.user) {
      const pass = decryptSecret(rawSmtp.password || "");
      const isPort465 = (rawSmtp.port || 465) === 465;
      const transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: rawSmtp.port || 465,
        secure: rawSmtp.secure ?? isPort465,
        auth: { user: rawSmtp.user, pass },
      });
      const from = rawSmtp.senderName
        ? `"${rawSmtp.senderName}" <${rawSmtp.user}>`
        : rawSmtp.user;

      await transport.sendMail({
        from,
        to: input.to,
        subject: input.subject,
        text: input.text,
        html: input.html,
      });
      return { delivered: true };
    }
  } catch (err) {
    logger.warn("tenant smtp lookup or send error, falling back to env smtp", { err: err instanceof Error ? err.message : String(err) });
  }

  // 3. Fallback to env() SMTP
  if (!smtpConfigured()) {
    logger.info("mail (no SMTP, logged only)", { to: input.to, subject: input.subject, text: input.text });
    return { delivered: false };
  }
  const e = env();
  try {
    const transport = nodemailer.createTransport({
      host: e.SMTP_HOST,
      port: e.SMTP_PORT,
      secure: e.SMTP_PORT === 465,
      auth: e.SMTP_USER ? { user: e.SMTP_USER, pass: e.SMTP_PASS } : undefined,
    });
    await transport.sendMail({ from: e.SMTP_FROM, to: input.to, subject: input.subject, text: input.text, html: input.html });
    return { delivered: true };
  } catch (err) {
    logger.error("mail send failed", { to: input.to, err: err instanceof Error ? err.message : String(err) });
    return { delivered: false };
  }
}

/**
 * ทดสอบการเชื่อมต่อ SMTP และส่งอีเมลทดสอบ
 */
export async function verifyAndSendTestMail(config: {
  host: string;
  port: number;
  secure?: boolean;
  user: string;
  pass: string;
  senderName?: string;
  targetEmail: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const isPort465 = config.port === 465;
    const transport = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure ?? isPort465,
      auth: { user: config.user, pass: config.pass },
    });

    await transport.verify();

    const fromAddress = config.senderName
      ? `"${config.senderName}" <${config.user}>`
      : config.user;

    await transport.sendMail({
      from: fromAddress,
      to: config.targetEmail,
      subject: "ทดสอบการเชื่อมต่อระบบอีเมล (FMS Test Mail)",
      text: "ระบบได้ทำการเชื่อมต่อกับ Gmail SMTP สำเร็จเรียบร้อยแล้ว การส่งอีเมลของระบบพร้อมใช้งาน",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
          <h2 style="color: #059669; margin-top: 0; margin-bottom: 14px; font-size: 20px;">✔ ทดสอบการเชื่อมต่อ Gmail SMTP สำเร็จ</h2>
          <p style="color: #334155; line-height: 1.6; font-size: 15px; margin-bottom: 20px;">
            อีเมลนี้เป็นการทดสอบจากระบบบริหารงานคณะ (Faculty Management System) แสดงว่าการตั้งค่าบัญชี Gmail และรหัสผ่านแอปพลิเคชัน (App Password) ถูกต้องสมบูรณ์และสามารถส่งอีเมลออกได้จริง
          </p>
          <div style="background-color: #f8fafc; border-radius: 12px; padding: 16px 20px; border: 1px solid #f1f5f9;">
            <ul style="color: #475569; font-size: 13px; line-height: 1.8; margin: 0; padding-left: 20px;">
              <li><strong>บัญชีผู้ส่ง:</strong> ${config.user}</li>
              <li><strong>ชื่อผู้ส่ง:</strong> ${config.senderName || "(ไม่ได้ระบุ)"}</li>
              <li><strong>พอร์ตการเชื่อมต่อ:</strong> ${config.port} (${config.secure ?? isPort465 ? "SSL" : "TLS"})</li>
              <li><strong>ส่งไปยัง:</strong> ${config.targetEmail}</li>
            </ul>
          </div>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 24px; margin-bottom: 0;">
            ส่งโดยระบบทดสอบอัตโนมัติ • Faculty Management System (FMS)
          </p>
        </div>
      `,
    });

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error("SMTP test failed", { error: message, user: config.user });
    return { success: false, error: message };
  }
}
