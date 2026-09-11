"use client";
import { useState, useRef, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiyonCard, LiyonField, PalettePicker } from "@/shared/components/liyon";
import { useT } from "@/shared/lib/i18n/client";
import type { PaletteId } from "@/shared/lib/palette";
import type { TenantSettings } from "@/features/identity";
import { updateSettingsAction, uploadLogoAction } from "@/features/identity/actions";

export function SettingsForm({ initial }: { initial: TenantSettings }) {
  const t = useT();
  const router = useRouter();
  const [form, setForm] = useState({ nameTh: initial.nameTh, nameEn: initial.nameEn, logoUrl: initial.logoUrl ?? "", palette: initial.palette as PaletteId });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [pending, start] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [imgError, setImgError] = useState(false);
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

  function save() {
    start(async () => {
      const r = await updateSettingsAction(form);
      if (!r.ok) { setErrors(r.error.fieldErrors ?? {}); if (!r.error.fieldErrors) toast.error(t(`error.${r.error.code}`)); return; }
      setErrors({});
      toast.success(t("settings.saveOk"));
      router.refresh();
    });
  }

  return (
    <>
      <header className="ph"><h1>{t("settings.title")}</h1></header>
      <div className="set-cards">
        <LiyonCard>
          <h2>{t("settings.orgTitle")}</h2>
          <div className="fields">
            <LiyonField label={t("settings.nameTh")} htmlFor="s-name-th" error={errors.nameTh?.[0]}><input id="s-name-th" value={form.nameTh} onChange={(e) => setForm({ ...form, nameTh: e.target.value })} /></LiyonField>
            <LiyonField label={t("settings.nameEn")} htmlFor="s-name-en" error={errors.nameEn?.[0]}><input id="s-name-en" value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} /></LiyonField>
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
        <LiyonCard>
          <h2>{t("settings.brandTitle")}</h2>
          <p>{t("settings.brandDesc")}</p>
          <PalettePicker value={form.palette} onChange={(p) => setForm({ ...form, palette: p })} label={t("settings.paletteLabel")} />
          {form.palette === "coral" && <p className="warn" role="note">{t("settings.coralWarn")}</p>}
        </LiyonCard>
        <div className="savebar"><Button type="button" onClick={save} disabled={pending}>{t("common.save")}</Button></div>
      </div>
    </>
  );
}
