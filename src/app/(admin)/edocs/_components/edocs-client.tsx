"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useT, useLocale } from "@/shared/lib/i18n/client";
import {
  FileText,
  Search,
  Eye,
  ExternalLink,
} from "lucide-react";
import {
  LiyonCard,
  DataTable,
  StatusPill,
  LiyonDialog,
  LiyonDialogHeader,
  LiyonDialogBody,
  LiyonDialogFooter,
  LiyonDialogCloseButton,
  LiyonField,
  LiyonSelect,
  RowMenuItem,
  type DataTableColumn,
  type StatusPillTone,
} from "@/shared/components/liyon";
import { Button } from "@/components/ui/button";
import type {
  EdocRequestDto,
  EdocTemplateDto,
  EdocStatus,
} from "@/features/edocs";
import { reviewEdocAction } from "@/features/edocs/actions";

interface Props {
  initialRequests: EdocRequestDto[];
  templates: EdocTemplateDto[];
  canManage: boolean;
}

export function EdocsClient({ initialRequests, templates, canManage }: Props) {
  const t = useT();
  const locale = useLocale();

  const [requests, setRequests] = useState<EdocRequestDto[]>(initialRequests);
  const [isPending, startTransition] = useTransition();

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("ALL");

  // Review Dialog State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<EdocRequestDto | null>(null);
  const [reviewStatus, setReviewStatus] = useState<EdocStatus>("APPROVED");
  const [reviewerRemarks, setReviewerRemarks] = useState("");

  const openReviewModal = (req: EdocRequestDto) => {
    setSelectedRequest(req);
    setReviewStatus(req.status === "SUBMITTED" ? "IN_REVIEW" : (req.status as EdocStatus));
    setReviewerRemarks(req.reviewerRemarks || "");
    setReviewModalOpen(true);
  };

  const handleSaveReview = () => {
    if (!selectedRequest) return;

    startTransition(async () => {
      const res = await reviewEdocAction({
        id: selectedRequest.id,
        status: reviewStatus,
        reviewerRemarks: reviewerRemarks || null,
      });

      if (res.ok) {
        toast.success(t("edocs.review.success"));
        setRequests((prev) => prev.map((r) => (r.id === res.data.id ? res.data : r)));
        setReviewModalOpen(false);
      } else {
        toast.error(res.error.message);
      }
    });
  };

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      !searchQuery.trim() ||
      r.trackingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.requesterEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.studentOrStaffId && r.studentOrStaffId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = selectedStatus === "ALL" || r.status === selectedStatus;
    const matchesTemplate = selectedTemplate === "ALL" || r.templateId === selectedTemplate;

    return matchesSearch && matchesStatus && matchesTemplate;
  });

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

  const columns: DataTableColumn<EdocRequestDto>[] = [
    {
      key: "code",
      header: t("edocs.field.trackingCode"),
      render: (row: EdocRequestDto) => (
        <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
          {row.trackingCode}
        </span>
      ),
    },
    {
      key: "requester",
      header: t("edocs.field.requesterName"),
      render: (row: EdocRequestDto) => (
        <div className="space-y-0.5 text-xs">
          <div className="font-semibold text-foreground">{row.requesterName}</div>
          <div className="text-muted-foreground text-[11px]">
            {row.studentOrStaffId ? `${row.studentOrStaffId} • ` : ""}{row.requesterEmail}
          </div>
        </div>
      ),
    },
    {
      key: "title",
      header: t("edocs.field.title"),
      render: (row: EdocRequestDto) => (
        <div className="space-y-0.5 max-w-sm text-xs">
          <div className="font-semibold text-foreground">{row.title}</div>
          <div className="text-[11px] text-muted-foreground">
            {locale === "th" ? row.templateNameTh : row.templateNameEn}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: t("edocs.field.status"),
      render: (row: EdocRequestDto) => (
        <StatusPill tone={getStatusTone(row.status)}>
          {getStatusLabel(row.status)}
        </StatusPill>
      ),
    },
    {
      key: "date",
      header: t("edocs.field.createdAt"),
      render: (row: EdocRequestDto) => (
        <span className="text-xs text-muted-foreground">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <span>{t("edocs.title")}</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          {t("edocs.subtitle")}
        </p>
      </div>

      <LiyonCard>
        {/* Toolbar */}
        <div className="p-4 border-b border-border/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            {/* Search */}
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("edocs.search.placeholder")}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-card border border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="w-36">
              <LiyonSelect
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="text-xs py-1.5"
              >
                <option value="ALL">{t("edocs.filter.allStatus")}</option>
                <option value="SUBMITTED">{t("edocs.status.submitted")}</option>
                <option value="IN_REVIEW">{t("edocs.status.inReview")}</option>
                <option value="APPROVED">{t("edocs.status.approved")}</option>
                <option value="REJECTED">{t("edocs.status.rejected")}</option>
              </LiyonSelect>
            </div>

            {/* Template Filter */}
            <div className="w-48">
              <LiyonSelect
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="text-xs py-1.5"
              >
                <option value="ALL">{t("edocs.filter.allTemplates")}</option>
                {templates.map((tpl) => (
                  <option key={tpl.id} value={tpl.id}>
                    {locale === "th" ? tpl.nameTh : tpl.nameEn}
                  </option>
                ))}
              </LiyonSelect>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            {filteredRequests.length} {locale === "th" ? "คำร้อง" : "requests"}
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          state={filteredRequests.length ? "data" : "empty"}
          headHeading={t("edocs.tabs.requests")}
          columns={columns}
          rows={filteredRequests}
          getRowId={(r: EdocRequestDto) => r.id}
          renderRowMenu={
            canManage
              ? (r: EdocRequestDto) => (
                  <>
                    <RowMenuItem onSelect={() => openReviewModal(r)}>
                      <Eye className="h-3.5 w-3.5 mr-2" />
                      <span>{t("edocs.action.review")}</span>
                    </RowMenuItem>
                    <RowMenuItem onSelect={() => window.open(`/requests?code=${r.trackingCode}`, "_blank")}>
                      <ExternalLink className="h-3.5 w-3.5 mr-2" />
                      <span>{t("edocs.action.track")}</span>
                    </RowMenuItem>
                  </>
                )
              : undefined
          }
          empty={{
            icon: <FileText className="h-8 w-8 text-muted-foreground" />,
            title: t("edocs.empty"),
            description: t("edocs.subtitle"),
          }}
          error={{
            icon: <FileText className="h-8 w-8 text-destructive" />,
            title: t("common.error"),
          }}
        />
      </LiyonCard>

      {/* Review Request Dialog */}
      <LiyonDialog open={reviewModalOpen} onOpenChange={setReviewModalOpen} wide>
        <LiyonDialogCloseButton label={locale === "th" ? "ปิด" : "Close"} />
        <LiyonDialogHeader
          title={t("edocs.action.review")}
          description={selectedRequest?.trackingCode}
        />

        {selectedRequest && (
          <LiyonDialogBody className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 text-xs">
            {/* Requester Info */}
            <div className="p-4 bg-muted/20 border border-border/50 rounded-2xl space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <span className="text-muted-foreground">{t("edocs.field.requesterName")}:</span>{" "}
                  <span className="font-semibold text-foreground">{selectedRequest.requesterName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">{t("edocs.field.requesterEmail")}:</span>{" "}
                  <span className="font-semibold text-foreground">{selectedRequest.requesterEmail}</span>
                </div>
                {selectedRequest.studentOrStaffId && (
                  <div>
                    <span className="text-muted-foreground">{t("edocs.field.studentOrStaffId")}:</span>{" "}
                    <span className="font-mono font-semibold text-foreground">{selectedRequest.studentOrStaffId}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Request Content */}
            <div className="space-y-2">
              <h3 className="font-bold text-foreground text-sm">
                {selectedRequest.title}
              </h3>
              <p className="text-muted-foreground whitespace-pre-line bg-background p-4 border border-border rounded-xl leading-relaxed">
                {selectedRequest.details}
              </p>
              {selectedRequest.attachmentUrl && (
                <div className="pt-1">
                  <a
                    href={selectedRequest.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-primary hover:underline font-medium"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>{t("edocs.field.attachmentUrl")}</span>
                  </a>
                </div>
              )}
            </div>

            {/* Status & Remarks Form */}
            <div className="border-t border-border pt-4 space-y-4">
              <LiyonField label={t("edocs.field.status")} htmlFor="reviewStatus">
                <LiyonSelect
                  id="reviewStatus"
                  value={reviewStatus}
                  onChange={(e) => setReviewStatus(e.target.value as EdocStatus)}
                  className="text-xs"
                >
                  <option value="IN_REVIEW">{t("edocs.status.inReview")}</option>
                  <option value="APPROVED">{t("edocs.status.approved")}</option>
                  <option value="REJECTED">{t("edocs.status.rejected")}</option>
                  <option value="CANCELLED">{t("edocs.status.cancelled")}</option>
                </LiyonSelect>
              </LiyonField>

              <LiyonField label={t("edocs.field.reviewerRemarks")} htmlFor="reviewerRemarks">
                <textarea
                  id="reviewerRemarks"
                  rows={3}
                  value={reviewerRemarks}
                  onChange={(e) => setReviewerRemarks(e.target.value)}
                  placeholder="ข้อความชี้แจง หรือเหตุผลในการอนุมัติ/ปฏิเสธ..."
                  className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </LiyonField>
            </div>
          </LiyonDialogBody>
        )}

        <LiyonDialogFooter>
          <Button
            variant="outline"
            onClick={() => setReviewModalOpen(false)}
            disabled={isPending}
            className="text-xs"
          >
            {locale === "th" ? "ยกเลิก" : "Cancel"}
          </Button>
          <Button
            onClick={handleSaveReview}
            disabled={isPending}
            className="bg-primary text-primary-foreground text-xs"
          >
            {locale === "th" ? "บันทึกผลการพิจารณา" : "Save Review"}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>
    </div>
  );
}
