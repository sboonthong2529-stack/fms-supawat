"use client";

import { useState, useTransition } from "react";
import { Plus, Edit2, Trash2, Pin, PinOff, Newspaper, Search, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useT, useLocale } from "@/shared/lib/i18n/client";
import { formatDate } from "@/shared/lib/format";
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
import type { NewsArticleDto, NewsCategoryType, NewsStatusType } from "@/features/news";
import {
  createNewsAction,
  updateNewsAction,
  deleteNewsAction,
  togglePinNewsAction,
} from "@/features/news/actions";

interface Props {
  initialNews: NewsArticleDto[];
  canManage: boolean;
}

export function NewsClient({ initialNews, canManage }: Props) {
  const t = useT();
  const locale = useLocale();
  const [items, setItems] = useState<NewsArticleDto[]>(initialNews);
  const [isPending, startTransition] = useTransition();

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // Dialog states
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<NewsArticleDto | null>(null);
  const [editingItem, setEditingItem] = useState<NewsArticleDto | null>(null);

  // Form states
  const [formTitleTh, setFormTitleTh] = useState("");
  const [formTitleEn, setFormTitleEn] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formCategory, setFormCategory] = useState<NewsCategoryType>("GENERAL");
  const [formStatus, setFormStatus] = useState<NewsStatusType>("DRAFT");
  const [formCoverImageUrl, setFormCoverImageUrl] = useState("");
  const [formSummaryTh, setFormSummaryTh] = useState("");
  const [formSummaryEn, setFormSummaryEn] = useState("");
  const [formContentTh, setFormContentTh] = useState("");
  const [formContentEn, setFormContentEn] = useState("");
  const [formIsPinned, setFormIsPinned] = useState(false);

  const openCreateDialog = () => {
    setEditingItem(null);
    setFormTitleTh("");
    setFormTitleEn("");
    setFormSlug("");
    setFormCategory("GENERAL");
    setFormStatus("DRAFT");
    setFormCoverImageUrl("");
    setFormSummaryTh("");
    setFormSummaryEn("");
    setFormContentTh("");
    setFormContentEn("");
    setFormIsPinned(false);
    setModalOpen(true);
  };

  const openEditDialog = (item: NewsArticleDto) => {
    setEditingItem(item);
    setFormTitleTh(item.titleTh);
    setFormTitleEn(item.titleEn);
    setFormSlug(item.slug);
    setFormCategory(item.category as NewsCategoryType);
    setFormStatus(item.status as NewsStatusType);
    setFormCoverImageUrl(item.coverImageUrl ?? "");
    setFormSummaryTh(item.summaryTh ?? "");
    setFormSummaryEn(item.summaryEn ?? "");
    setFormContentTh(item.contentTh);
    setFormContentEn(item.contentEn);
    setFormIsPinned(item.isPinned);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formTitleTh.trim() || !formTitleEn.trim()) {
      toast.error(t("news.titleTh") + " / " + t("news.titleEn"));
      return;
    }
    if (!formContentTh.trim() || !formContentEn.trim()) {
      toast.error(t("news.contentTh") + " / " + t("news.contentEn"));
      return;
    }

    startTransition(async () => {
      if (editingItem) {
        const res = await updateNewsAction({
          id: editingItem.id,
          titleTh: formTitleTh,
          titleEn: formTitleEn,
          slug: formSlug || undefined,
          category: formCategory,
          status: formStatus,
          coverImageUrl: formCoverImageUrl || undefined,
          summaryTh: formSummaryTh || undefined,
          summaryEn: formSummaryEn || undefined,
          contentTh: formContentTh,
          contentEn: formContentEn,
          isPinned: formIsPinned,
        });

        if (res.ok) {
          toast.success(t("news.updateSuccess"));
          setItems((prev) => prev.map((item) => (item.id === res.data.id ? res.data : item)));
          setModalOpen(false);
        } else {
          toast.error(res.error.message);
        }
      } else {
        const res = await createNewsAction({
          titleTh: formTitleTh,
          titleEn: formTitleEn,
          slug: formSlug || undefined,
          category: formCategory,
          status: formStatus,
          coverImageUrl: formCoverImageUrl || undefined,
          summaryTh: formSummaryTh || undefined,
          summaryEn: formSummaryEn || undefined,
          contentTh: formContentTh,
          contentEn: formContentEn,
          isPinned: formIsPinned,
        });

        if (res.ok) {
          toast.success(t("news.createSuccess"));
          setItems((prev) => [res.data, ...prev]);
          setModalOpen(false);
        } else {
          toast.error(res.error.message);
        }
      }
    });
  };

  const handleDelete = (item: NewsArticleDto) => {
    startTransition(async () => {
      const res = await deleteNewsAction(item.id);
      if (res.ok) {
        toast.success(t("news.deleteSuccess"));
        setItems((prev) => prev.filter((i) => i.id !== item.id));
        setDeleteConfirmItem(null);
      } else {
        toast.error(res.error.message);
      }
    });
  };

  const handleTogglePin = (item: NewsArticleDto) => {
    startTransition(async () => {
      const res = await togglePinNewsAction(item.id);
      if (res.ok) {
        toast.success(res.data.isPinned ? t("news.pinned") : t("common.saved"));
        setItems((prev) => prev.map((i) => (i.id === res.data.id ? res.data : i)));
      } else {
        toast.error(res.error.message);
      }
    });
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "ACADEMIC": return t("news.category.academic");
      case "ACTIVITY": return t("news.category.activity");
      case "GENERAL": return t("news.category.general");
      case "PROCUREMENT": return t("news.category.procurement");
      default: return category;
    }
  };

  const getStatusTone = (status: string): StatusPillTone => {
    switch (status) {
      case "PUBLISHED": return "ok";
      case "DRAFT": return "warn";
      case "ARCHIVED": return "off";
      default: return "info";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PUBLISHED": return t("news.status.published");
      case "DRAFT": return t("news.status.draft");
      case "ARCHIVED": return t("news.status.archived");
      default: return status;
    }
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    if (selectedCategory !== "ALL" && item.category !== selectedCategory) return false;
    if (selectedStatus !== "ALL" && item.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTh = item.titleTh.toLowerCase().includes(q);
      const matchEn = item.titleEn.toLowerCase().includes(q);
      const matchSlug = item.slug.toLowerCase().includes(q);
      if (!matchTh && !matchEn && !matchSlug) return false;
    }
    return true;
  });

  const columns: DataTableColumn<NewsArticleDto>[] = [
    {
      key: "title",
      header: t("news.titleTh"),
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            {row.isPinned && (
              <span className="inline-flex items-center gap-1 rounded bg-amber-500/15 px-1.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                <Pin className="h-3 w-3" />
                {t("news.pinned")}
              </span>
            )}
            <span className="font-medium text-foreground">{locale === "th" ? row.titleTh : row.titleEn}</span>
          </div>
          <span className="text-xs text-muted-foreground">{locale === "th" ? row.titleEn : row.titleTh}</span>
        </div>
      ),
    },
    {
      key: "category",
      header: t("news.category"),
      render: (row) => (
        <span className="inline-block rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {getCategoryLabel(row.category)}
        </span>
      ),
    },
    {
      key: "status",
      header: t("news.status"),
      render: (row) => (
        <StatusPill tone={getStatusTone(row.status)}>
          {getStatusLabel(row.status)}
        </StatusPill>
      ),
    },
    {
      key: "publishedAt",
      header: t("news.publishedAt"),
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {row.publishedAt ? formatDate(new Date(row.publishedAt), locale) : "-"}
        </span>
      ),
    },
    {
      key: "viewCount",
      header: t("news.viewCount"),
      render: (row) => (
        <span className="text-xs font-mono text-muted-foreground">
          {row.viewCount.toLocaleString()}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("news.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("news.subtitle")}</p>
        </div>
        {canManage && (
          <Button onClick={openCreateDialog} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t("news.create")}
          </Button>
        )}
      </div>

      <LiyonCard>
        <div className="p-4 border-b border-border flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-1 items-center gap-3 min-w-[280px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("news.portal.searchPlaceholder")}
                className="w-full pl-9 pr-3 py-1.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <LiyonSelect
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-sm py-1.5"
            >
              <option value="ALL">{t("news.category.all")}</option>
              <option value="GENERAL">{t("news.category.general")}</option>
              <option value="ACADEMIC">{t("news.category.academic")}</option>
              <option value="ACTIVITY">{t("news.category.activity")}</option>
              <option value="PROCUREMENT">{t("news.category.procurement")}</option>
            </LiyonSelect>
            <LiyonSelect
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-sm py-1.5"
            >
              <option value="ALL">{t("common.all")}</option>
              <option value="PUBLISHED">{t("news.status.published")}</option>
              <option value="DRAFT">{t("news.status.draft")}</option>
              <option value="ARCHIVED">{t("news.status.archived")}</option>
            </LiyonSelect>
          </div>
        </div>

        <DataTable
          state={filteredItems.length ? "data" : "empty"}
          headHeading={t("news.title")}
          columns={columns}
          rows={filteredItems}
          getRowId={(row) => row.id}
          renderRowMenu={
            canManage
              ? (row) => (
                  <>
                    <RowMenuItem
                      onSelect={() => openEditDialog(row)}
                      icon={<Edit2 className="h-4 w-4" />}
                    >
                      {t("news.edit")}
                    </RowMenuItem>
                    <RowMenuItem
                      onSelect={() => handleTogglePin(row)}
                      icon={row.isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                    >
                      {row.isPinned ? t("news.cancel") : t("news.isPinned")}
                    </RowMenuItem>
                    {row.status === "PUBLISHED" && (
                      <RowMenuItem
                        onSelect={() => window.open(`/announcements/${row.slug}`, "_blank")}
                        icon={<ExternalLink className="h-4 w-4" />}
                      >
                        {t("news.portal.readMore")}
                      </RowMenuItem>
                    )}
                    <RowMenuItem
                      danger
                      onSelect={() => setDeleteConfirmItem(row)}
                      icon={<Trash2 className="h-4 w-4" />}
                    >
                      {t("news.delete")}
                    </RowMenuItem>
                  </>
                )
              : undefined
          }
          empty={{
            icon: <Newspaper className="h-8 w-8 text-muted-foreground" />,
            title: t("news.empty"),
            description: t("news.subtitle"),
          }}
          error={{
            icon: <Newspaper className="h-8 w-8 text-destructive" />,
            title: t("common.error"),
          }}
        />
      </LiyonCard>

      {/* Modal Create / Edit News */}
      <LiyonDialog open={modalOpen} onOpenChange={setModalOpen} wide>
        <LiyonDialogCloseButton label={t("news.cancel")} />
        <LiyonDialogHeader
          title={editingItem ? t("news.edit") : t("news.create")}
          description={editingItem ? editingItem.titleTh : t("news.subtitle")}
        />
        <LiyonDialogBody className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LiyonField label={t("news.titleTh")} htmlFor="titleTh">
              <input
                id="titleTh"
                type="text"
                value={formTitleTh}
                onChange={(e) => setFormTitleTh(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
                required
              />
            </LiyonField>

            <LiyonField label={t("news.titleEn")} htmlFor="titleEn">
              <input
                id="titleEn"
                type="text"
                value={formTitleEn}
                onChange={(e) => setFormTitleEn(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
                required
              />
            </LiyonField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <LiyonField label={t("news.category")} htmlFor="category">
              <LiyonSelect
                id="category"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as NewsCategoryType)}
              >
                <option value="GENERAL">{t("news.category.general")}</option>
                <option value="ACADEMIC">{t("news.category.academic")}</option>
                <option value="ACTIVITY">{t("news.category.activity")}</option>
                <option value="PROCUREMENT">{t("news.category.procurement")}</option>
              </LiyonSelect>
            </LiyonField>

            <LiyonField label={t("news.status")} htmlFor="status">
              <LiyonSelect
                id="status"
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as NewsStatusType)}
              >
                <option value="DRAFT">{t("news.status.draft")}</option>
                <option value="PUBLISHED">{t("news.status.published")}</option>
                <option value="ARCHIVED">{t("news.status.archived")}</option>
              </LiyonSelect>
            </LiyonField>

            <LiyonField label={t("news.isPinned")} htmlFor="isPinned">
              <div className="flex items-center gap-2 pt-2">
                <input
                  id="isPinned"
                  type="checkbox"
                  checked={formIsPinned}
                  onChange={(e) => setFormIsPinned(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="isPinned" className="text-sm font-medium text-foreground cursor-pointer">
                  {t("news.pinned")}
                </label>
              </div>
            </LiyonField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LiyonField label="URL Slug" htmlFor="slug" hint="เช่น graduation-ceremony-2026 (เว้นว่างเพื่อสร้างอัตโนมัติ)">
              <input
                id="slug"
                type="text"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                placeholder="news-slug"
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
              />
            </LiyonField>

            <LiyonField label={t("news.coverImageUrl")} htmlFor="coverImageUrl">
              <input
                id="coverImageUrl"
                type="text"
                value={formCoverImageUrl}
                onChange={(e) => setFormCoverImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
              />
            </LiyonField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LiyonField label={t("news.summaryTh")} htmlFor="summaryTh">
              <textarea
                id="summaryTh"
                rows={3}
                value={formSummaryTh}
                onChange={(e) => setFormSummaryTh(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
              />
            </LiyonField>

            <LiyonField label={t("news.summaryEn")} htmlFor="summaryEn">
              <textarea
                id="summaryEn"
                rows={3}
                value={formSummaryEn}
                onChange={(e) => setFormSummaryEn(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
              />
            </LiyonField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LiyonField label={t("news.contentTh")} htmlFor="contentTh">
              <textarea
                id="contentTh"
                rows={7}
                value={formContentTh}
                onChange={(e) => setFormContentTh(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background font-sans"
                required
              />
            </LiyonField>

            <LiyonField label={t("news.contentEn")} htmlFor="contentEn">
              <textarea
                id="contentEn"
                rows={7}
                value={formContentEn}
                onChange={(e) => setFormContentEn(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background font-sans"
                required
              />
            </LiyonField>
          </div>
        </LiyonDialogBody>
        <LiyonDialogFooter className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setModalOpen(false)} disabled={isPending}>
            {t("news.cancel")}
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? t("common.loading") : t("news.save")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>

      {/* Delete confirmation dialog */}
      <LiyonDialog open={!!deleteConfirmItem} onOpenChange={(open) => !open && setDeleteConfirmItem(null)} danger>
        <LiyonDialogCloseButton label={t("news.cancel")} />
        <LiyonDialogHeader
          title={t("news.delete")}
          description={t("news.deleteConfirm")}
        />
        <LiyonDialogBody>
          <p className="font-semibold text-foreground">{deleteConfirmItem?.titleTh}</p>
        </LiyonDialogBody>
        <LiyonDialogFooter className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setDeleteConfirmItem(null)} disabled={isPending}>
            {t("news.cancel")}
          </Button>
          <Button variant="destructive" onClick={() => deleteConfirmItem && handleDelete(deleteConfirmItem)} disabled={isPending}>
            {isPending ? t("common.loading") : t("news.delete")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>
    </div>
  );
}
