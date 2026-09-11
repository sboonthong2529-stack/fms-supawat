"use client";
import { useState, useRef, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload, Trash2, Image as ImageIcon, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiyonCard, LiyonField, PalettePicker } from "@/shared/components/liyon";
import { useT } from "@/shared/lib/i18n/client";
import type { PaletteId } from "@/shared/lib/palette";
import type { TenantSettings } from "@/features/identity";
import { updateSettingsAction, uploadLogoAction, testSmtpAction } from "@/features/identity/actions";

export function SettingsForm({ initial }: { initial: TenantSettings }) {
  const t = useT();
  const router = useRouter();
  const [form, setForm] = useState({
    nameTh: initial.nameTh,
    nameEn: initial.nameEn,
    logoUrl: initial.logoUrl ?? "",
    palette: initial.palette as PaletteId,
    smtp: {
      enabled: initial.smtp?.enabled ?? false,
      user: initial.smtp?.user ?? "",
      password: "",
      senderName: initial.smtp?.senderName ?? "",
      port: initial.smtp?.port ?? 465,
      secure: initial.smtp?.secure ?? true,
    },
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [pending, start] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [targetTestEmail, setTargetTestEmail] = useState("");
  const [testingSmtp, setTestingSmtp] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("settings.uploadError"));
      return;
    }

    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);

    const res = await uploadLogoAction(fd);
    setUploading(false);

    if (res.ok) {
      setImgError(false);
      setForm((prev) => ({ ...prev, logoUrl: res.data.url }));
      toast.success(t("settings.uploadSuccess"));
    } else {
      toast.error(t("settings.uploadError"));
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleTestEmail() {
    if (!form.smtp.user) {
      toast.error(t("settings.smtpUserPh"));
      return;
    }
    const recipient = targetTestEmail.trim() || form.smtp.user;
    setTestingSmtp(true);
    const res = await testSmtpAction({
      user: form.smtp.user,
      password: form.smtp.password,
      senderName: form.smtp.senderName,
      port: form.smtp.port,
      secure: form.smtp.secure,
      targetEmail: recipient,
    });
    setTestingSmtp(false);

    if (res.ok) {
      toast.success(t("settings.smtpTestSuccess"));
    } else {
      const msg = res.error?.message || (res.error?.fieldErrors ? JSON.stringify(res.error.fieldErrors) : "Connection failed");
      toast.error(t("settings.smtpTestFail", { error: msg }));
    }
  }

  function save() {
    start(async () => {
      const r = await updateSettingsAction(form);
      if (!r.ok) {
        setErrors(r.error.fieldErrors ?? {});
        if (!r.error.fieldErrors) toast.error(t(`error.${r.error.code}`));
        return;
      }
      setErrors({});
      toast.success(t("settings.saveOk"));
      router.refresh();
    });
  }

  return (
    <>
      <header className="ph"><h1>{t("settings.title")}</h1></header>
      <div className="set-cards space-y-6">
        {/* Organization Info & Logo */}
        <LiyonCard>
          <h2>{t("settings.orgTitle")}</h2>
          <div className="fields">
            <LiyonField label={t("settings.nameTh")} htmlFor="s-name-th" error={errors.nameTh?.[0]}>
              <input id="s-name-th" value={form.nameTh} onChange={(e) => setForm({ ...form, nameTh: e.target.value })} />
            </LiyonField>
            <LiyonField label={t("settings.nameEn")} htmlFor="s-name-en" error={errors.nameEn?.[0]}>
              <input id="s-name-en" value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} />
            </LiyonField>
            <LiyonField label={t("settings.logoUrl")} htmlFor="s-logo" hint={t("common.optional")} error={errors.logoUrl?.[0]}>
              <div className="space-y-3 pt-1">
                <div className="flex flex-wrap items-center gap-4">
                  {form.logoUrl ? (
                    <div className="relative h-16 w-36 rounded-xl border border-border bg-muted/30 p-1 flex items-center justify-center">
                      {imgError ? (
                        <div className="flex flex-col items-center justify-center text-center px-2">
                          <span className="text-[10px] text-destructive font-medium">รูปภาพไม่สามารถแสดงได้</span>
                          <span className="text-[9px] text-muted-foreground">โปรดลองอัปโหลดใหม่</span>
                        </div>
                      ) : (
                        <Image
                          src={form.logoUrl}
                          alt="Logo"
                          width={130}
                          height={55}
                          className="max-h-full max-w-full object-contain"
                          unoptimized
                          onError={() => setImgError(true)}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setImgError(false);
                          setForm({ ...form, logoUrl: "" });
                        }}
                        className="absolute top-1 right-1 rounded-full bg-destructive text-destructive-foreground p-1 shadow-md hover:bg-destructive/90 transition-colors z-10"
                        title={t("settings.removeLogo")}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="h-16 w-36 rounded-xl border border-dashed border-border bg-muted/20 flex flex-col items-center justify-center text-muted-foreground text-xs gap-1">
                      <ImageIcon className="h-5 w-5 opacity-40" />
                      <span className="text-[10px] text-muted-foreground">{t("settings.uploadHint")}</span>
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading || pending}
                      className="rounded-xl inline-flex items-center gap-2"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>{t("settings.uploading")}</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          <span>{t("settings.uploadLogo")}</span>
                        </>
                      )}
                    </Button>
                    <span className="text-[11px] text-muted-foreground">{t("settings.uploadHint")}</span>
                  </div>
                </div>

                <input
                  id="s-logo"
                  type="text"
                  placeholder="https://... หรือ /uploads/logos/..."
                  value={form.logoUrl}
                  onChange={(e) => {
                    setImgError(false);
                    setForm({ ...form, logoUrl: e.target.value });
                  }}
                  className="w-full text-xs"
                />
              </div>
            </LiyonField>
          </div>
        </LiyonCard>

        {/* Gmail SMTP Configuration */}
        <LiyonCard>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3 mb-4">
            <div>
              <h2>{t("settings.smtpTitle")}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{t("settings.smtpDesc")}</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none bg-muted/30 px-3 py-1.5 rounded-xl border border-border/60 hover:bg-muted/50 transition-colors">
              <input
                type="checkbox"
                checked={form.smtp.enabled}
                onChange={(e) =>
                  setForm({
                    ...form,
                    smtp: { ...form.smtp, enabled: e.target.checked },
                  })
                }
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
              />
              <span className="text-xs font-semibold text-foreground">{t("settings.smtpEnabled")}</span>
            </label>
          </div>

          <div className="fields space-y-4">
            {/* Google App Password Guidance */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-xs text-muted-foreground flex gap-3 items-start">
              <div className="h-5 w-5 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5 font-bold">
                i
              </div>
              <div className="leading-relaxed">
                <span className="font-semibold text-foreground">คำแนะนำการใช้งาน Google App Password:</span>{" "}
                {t("settings.smtpHelp")}{" "}
                <a
                  href="https://myaccount.google.com/apppasswords"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline font-medium hover:opacity-80 inline-flex items-center gap-1"
                >
                  เปิด Google App Passwords ↗
                </a>
              </div>
            </div>

            <LiyonField label={t("settings.smtpUser")} htmlFor="s-smtp-user" error={errors["smtp.user"]?.[0]}>
              <input
                id="s-smtp-user"
                type="email"
                placeholder={t("settings.smtpUserPh")}
                value={form.smtp.user}
                onChange={(e) =>
                  setForm({
                    ...form,
                    smtp: { ...form.smtp, user: e.target.value },
                  })
                }
              />
            </LiyonField>

            <LiyonField
              label={t("settings.smtpPassword")}
              htmlFor="s-smtp-password"
              hint={initial.smtp?.hasPassword ? t("settings.smtpPasswordSaved") : undefined}
              error={errors["smtp.password"]?.[0]}
            >
              <input
                id="s-smtp-password"
                type="password"
                placeholder={
                  initial.smtp?.hasPassword
                    ? t("settings.smtpPasswordSaved")
                    : t("settings.smtpPasswordPh")
                }
                value={form.smtp.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    smtp: { ...form.smtp, password: e.target.value },
                  })
                }
              />
            </LiyonField>

            <LiyonField label={t("settings.smtpSenderName")} htmlFor="s-smtp-sender" hint={t("common.optional")}>
              <input
                id="s-smtp-sender"
                type="text"
                placeholder={t("settings.smtpSenderNamePh")}
                value={form.smtp.senderName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    smtp: { ...form.smtp, senderName: e.target.value },
                  })
                }
              />
            </LiyonField>

            <LiyonField label={t("settings.smtpPort")} htmlFor="s-smtp-port">
              <div className="flex flex-wrap gap-5 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs select-none">
                  <input
                    type="radio"
                    name="smtp-port"
                    checked={form.smtp.port === 465}
                    onChange={() =>
                      setForm({
                        ...form,
                        smtp: { ...form.smtp, port: 465, secure: true },
                      })
                    }
                  />
                  <span>{t("settings.smtpPortSsl")}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs select-none">
                  <input
                    type="radio"
                    name="smtp-port"
                    checked={form.smtp.port === 587}
                    onChange={() =>
                      setForm({
                        ...form,
                        smtp: { ...form.smtp, port: 587, secure: false },
                      })
                    }
                  />
                  <span>{t("settings.smtpPortTls")}</span>
                </label>
              </div>
            </LiyonField>

            {/* Test Email Section */}
            <div className="pt-4 border-t border-border mt-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                {t("settings.smtpTestSection")}
              </h3>
              <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
                <input
                  type="email"
                  placeholder={form.smtp.user || t("settings.smtpTargetEmailPh")}
                  value={targetTestEmail}
                  onChange={(e) => setTargetTestEmail(e.target.value)}
                  className="text-xs flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleTestEmail}
                  disabled={testingSmtp || pending || !form.smtp.user}
                  className="shrink-0 rounded-xl inline-flex items-center gap-2"
                >
                  {testingSmtp ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>{t("settings.smtpTesting")}</span>
                    </>
                  ) : (
                    <>
                      <Mail className="h-3.5 w-3.5" />
                      <span>{t("settings.smtpTestBtn")}</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </LiyonCard>

        {/* Color Palette */}
        <LiyonCard>
          <h2>{t("settings.brandTitle")}</h2>
          <p>{t("settings.brandDesc")}</p>
          <PalettePicker value={form.palette} onChange={(p) => setForm({ ...form, palette: p })} label={t("settings.paletteLabel")} />
          {form.palette === "coral" && <p className="warn" role="note">{t("settings.coralWarn")}</p>}
        </LiyonCard>

        {/* Save Bar */}
        <div className="savebar"><Button type="button" onClick={save} disabled={pending}>{t("common.save")}</Button></div>
      </div>
    </>
  );
}
