"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useT, useLocale } from "@/shared/lib/i18n/client";
import {
  FileText,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
  Send,
  Sparkles,
} from "lucide-react";
import { StatusPill, type StatusPillTone } from "@/shared/components/liyon";
import { Button } from "@/components/ui/button";
import type {
  EdocTemplateDto,
  EdocRequestDto,
  RequesterType,
} from "@/features/edocs";
import {
  submitEdocAction,
  trackEdocAction,
} from "@/features/edocs/actions";

interface Props {
  templates: EdocTemplateDto[];
  initialTrackCode?: string;
}

export function RequestsClient({ templates, initialTrackCode = "" }: Props) {
  const t = useT();
  const locale = useLocale();

  const [activeTab, setActiveTab] = useState<"submit" | "track">(initialTrackCode ? "track" : "submit");
  const [isPending, startTransition] = useTransition();

  // Submit Form State
  const [templateId, setTemplateId] = useState(templates[0]?.id || "");
  const [requesterName, setRequesterName] = useState("");
  const [requesterEmail, setRequesterEmail] = useState("");
  const [requesterPhone, setRequesterPhone] = useState("");
  const [requesterType, setRequesterType] = useState<RequesterType>("STUDENT");
  const [studentOrStaffId, setStudentOrStaffId] = useState("");
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [submittedResult, setSubmittedResult] = useState<EdocRequestDto | null>(null);

  // Track State
  const [trackCodeInput, setTrackCodeInput] = useState(initialTrackCode);
  const [trackResult, setTrackResult] = useState<EdocRequestDto | null>(null);
  const [trackSearched, setTrackSearched] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requesterName.trim() || !requesterEmail.trim() || !title.trim() || !details.trim()) {
      toast.error(t("edocs.field.title") + ", " + t("edocs.field.requesterName"));
      return;
    }

    startTransition(async () => {
      const res = await submitEdocAction({
        templateId: templateId || null,
        requesterName,
        requesterEmail,
        requesterPhone: requesterPhone || null,
        requesterType,
        studentOrStaffId: studentOrStaffId || null,
        title,
        details,
        attachmentUrl: attachmentUrl || null,
      });

      if (res.ok) {
        toast.success(t("edocs.submit.success"));
        setSubmittedResult(res.data);
      } else {
        toast.error(res.error.message);
      }
    });
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackCodeInput.trim()) return;

    startTransition(async () => {
      setTrackSearched(true);
      const res = await trackEdocAction(trackCodeInput.trim());
      if (res.ok && res.data) {
        setTrackResult(res.data);
      } else {
        setTrackResult(null);
        toast.error(t("edocs.notFound"));
      }
    });
  };

  const getStatusTone = (status: string): StatusPillTone => {
    switch (status) {
      case "APPROVED": return "ok";
      case "REJECTED": return "bad";
      case "IN_REVIEW": return "warn";
      case "CANCELLED": return "off";
      default: return "info";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "APPROVED": return t("edocs.status.approved");
      case "REJECTED": return t("edocs.status.rejected");
      case "IN_REVIEW": return t("edocs.status.inReview");
      case "CANCELLED": return t("edocs.status.cancelled");
      default: return t("edocs.status.submitted");
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 space-y-10 max-w-4xl">
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5" />
          <span>E-Document & Request Tracking</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          {t("edocs.publicTitle")}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          {t("edocs.publicSubtitle")}
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex justify-center border-b border-border">
        <div className="flex gap-4">
          <button
            onClick={() => { setActiveTab("submit"); setSubmittedResult(null); }}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "submit"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>{t("edocs.action.submit")}</span>
          </button>
          <button
            onClick={() => setActiveTab("track")}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "track"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Search className="h-4 w-4" />
            <span>{t("edocs.action.track")}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SUBMIT FORM */}
      {activeTab === "submit" && (
        <div>
          {submittedResult ? (
            <div className="bg-card border border-border rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">
                  {t("edocs.submit.success")}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {locale === "th"
                    ? "คำร้องของท่านเข้าสู่ระบบเรียบร้อยแล้ว เจ้าหน้าที่จะดำเนินการตรวจสอบตามขั้นตอน"
                    : "Your request has been received and is queued for academic review."}
                </p>
              </div>

              {/* Tracking Code Box */}
              <div className="p-6 bg-muted/40 border border-border rounded-2xl max-w-md mx-auto space-y-2">
                <span className="text-xs text-muted-foreground uppercase font-semibold">
                  {t("edocs.field.trackingCode")}
                </span>
                <div className="text-2xl sm:text-3xl font-mono font-black text-primary tracking-wider select-all">
                  {submittedResult.trackingCode}
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Button
                  onClick={() => {
                    setTrackCodeInput(submittedResult.trackingCode);
                    setActiveTab("track");
                    setTrackResult(submittedResult);
                    setTrackSearched(true);
                  }}
                  className="bg-primary text-primary-foreground text-xs px-6 py-2 rounded-xl"
                >
                  <span>{t("edocs.action.track")}</span>
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSubmittedResult(null);
                    setTitle("");
                    setDetails("");
                  }}
                  className="text-xs px-6 py-2 rounded-xl"
                >
                  {locale === "th" ? "ยื่นคำร้องใหม่อีกฉบับ" : "Submit Another Request"}
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    {t("edocs.field.template")}
                  </label>
                  <select
                    value={templateId}
                    onChange={(e) => setTemplateId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {templates.map((tpl) => (
                      <option key={tpl.id} value={tpl.id}>
                        {locale === "th" ? tpl.nameTh : tpl.nameEn} ({tpl.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    {t("edocs.field.requesterType")}
                  </label>
                  <select
                    value={requesterType}
                    onChange={(e) => setRequesterType(e.target.value as RequesterType)}
                    className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="STUDENT">{t("edocs.type.student")}</option>
                    <option value="FACULTY">{t("edocs.type.faculty")}</option>
                    <option value="STAFF">{t("edocs.type.staff")}</option>
                    <option value="GUEST">{t("edocs.type.guest")}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    {t("edocs.field.requesterName")} *
                  </label>
                  <input
                    type="text"
                    required
                    value={requesterName}
                    onChange={(e) => setRequesterName(e.target.value)}
                    placeholder="เช่น สมศักดิ์ มีสุข"
                    className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    {t("edocs.field.requesterEmail")} *
                  </label>
                  <input
                    type="email"
                    required
                    value={requesterEmail}
                    onChange={(e) => setRequesterEmail(e.target.value)}
                    placeholder="student@mail.kmutt.ac.th"
                    className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    {t("edocs.field.requesterPhone")}
                  </label>
                  <input
                    type="tel"
                    value={requesterPhone}
                    onChange={(e) => setRequesterPhone(e.target.value)}
                    placeholder="081-234-5678"
                    className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    {t("edocs.field.studentOrStaffId")}
                  </label>
                  <input
                    type="text"
                    value={studentOrStaffId}
                    onChange={(e) => setStudentOrStaffId(e.target.value)}
                    placeholder="เช่น 6601234567"
                    className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  {t("edocs.field.title")} *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="เช่น ขอเปิดรายวิชา CPE301 เพิ่มเติม หรือ ขอผ่อนผันค่าธรรมเนียม"
                  className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  {t("edocs.field.details")} *
                </label>
                <textarea
                  rows={4}
                  required
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="ระบุเหตุผล รายละเอียด หรือข้อความที่ต้องการยื่นต่อคณะ..."
                  className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  {t("edocs.field.attachmentUrl")} (Optional)
                </label>
                <input
                  type="url"
                  value={attachmentUrl}
                  onChange={(e) => setAttachmentUrl(e.target.value)}
                  placeholder="https://drive.google.com/... หรือ ลิงก์เอกสารแนบ"
                  className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-primary text-primary-foreground text-xs px-8 py-2 rounded-xl flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  <span>{t("edocs.action.submit")}</span>
                </Button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* TAB 2: TRACK STATUS */}
      {activeTab === "track" && (
        <div className="space-y-8">
          <form onSubmit={handleTrack} className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 max-w-xl mx-auto">
            <h2 className="text-base font-bold text-foreground text-center">
              {t("edocs.action.track")}
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={trackCodeInput}
                onChange={(e) => setTrackCodeInput(e.target.value)}
                placeholder="เช่น REQ-2026-ABCD"
                className="flex-1 px-4 py-2 text-sm font-mono uppercase bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button
                type="submit"
                disabled={isPending}
                className="bg-primary text-primary-foreground text-xs px-6 rounded-xl"
              >
                <Search className="h-4 w-4 mr-1.5" />
                <span>{locale === "th" ? "ค้นหา" : "Track"}</span>
              </Button>
            </div>
          </form>

          {trackResult && (
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border/60">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">
                    {t("edocs.field.trackingCode")}
                  </span>
                  <div className="text-xl font-mono font-bold text-foreground">
                    {trackResult.trackingCode}
                  </div>
                </div>

                <div>
                  <StatusPill tone={getStatusTone(trackResult.status)}>
                    {getStatusLabel(trackResult.status)}
                  </StatusPill>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground">{t("edocs.field.requesterName")}:</span>{" "}
                  <span className="font-semibold text-foreground">{trackResult.requesterName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">{t("edocs.field.requesterEmail")}:</span>{" "}
                  <span className="font-semibold text-foreground">{trackResult.requesterEmail}</span>
                </div>
                {trackResult.studentOrStaffId && (
                  <div>
                    <span className="text-muted-foreground">{t("edocs.field.studentOrStaffId")}:</span>{" "}
                    <span className="font-mono font-semibold text-foreground">{trackResult.studentOrStaffId}</span>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">{t("edocs.field.createdAt")}:</span>{" "}
                  <span className="text-foreground">{new Date(trackResult.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <h3 className="text-sm font-bold text-foreground">
                  {trackResult.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line bg-muted/20 p-4 rounded-xl border border-border/40">
                  {trackResult.details}
                </p>
              </div>

              {/* Reviewer Remarks */}
              {trackResult.reviewerRemarks && (
                <div className="space-y-1 pt-2">
                  <h4 className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{t("edocs.field.reviewerRemarks")}</span>
                  </h4>
                  <p className="text-xs text-foreground bg-primary/5 p-4 rounded-xl border border-primary/20 leading-relaxed">
                    {trackResult.reviewerRemarks}
                  </p>
                </div>
              )}
            </div>
          )}

          {trackSearched && !trackResult && (
            <div className="text-center py-12 bg-card border border-border rounded-2xl text-xs text-muted-foreground space-y-2">
              <XCircle className="h-8 w-8 text-destructive mx-auto" />
              <p>{t("edocs.notFound")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
