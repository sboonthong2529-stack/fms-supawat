"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useT, useLocale } from "@/shared/lib/i18n/client";
import {
  Building2,
  Calendar,
  Plus,
  Edit2,
  Trash2,
  Clock,
  Search,
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
  FacilityItemDto,
  FacilityBookingDto,
  FacilityType,
  BookingStatus,
} from "@/features/facilities";
import {
  createFacilityAction,
  updateFacilityAction,
  deleteFacilityAction,
  reviewBookingAction,
} from "@/features/facilities/actions";

interface Props {
  initialFacilities: FacilityItemDto[];
  initialBookings: FacilityBookingDto[];
  canManage: boolean;
}

export function FacilitiesAdminClient({
  initialFacilities,
  initialBookings,
  canManage,
}: Props) {
  const t = useT();
  const locale = useLocale();

  const [activeTab, setActiveTab] = useState<"bookings" | "facilities">("bookings");
  const [facilities, setFacilities] = useState<FacilityItemDto[]>(initialFacilities);
  const [bookings, setBookings] = useState<FacilityBookingDto[]>(initialBookings);
  const [isPending, startTransition] = useTransition();

  // Booking Filters
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>("ALL");

  // Facility Filters
  const [facilitySearch, setFacilitySearch] = useState("");
  const [facilityTypeFilter, setFacilityTypeFilter] = useState<string>("ALL");

  // Review Booking Modal
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<FacilityBookingDto | null>(null);
  const [reviewStatus, setReviewStatus] = useState<BookingStatus>("APPROVED");
  const [rejectionReason, setRejectionReason] = useState("");

  // Facility Modal
  const [facilityModalOpen, setFacilityModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<FacilityItemDto | null>(null);
  const [deleteFacilityConfirm, setDeleteFacilityConfirm] = useState<FacilityItemDto | null>(null);

  // Facility Form State
  const [code, setCode] = useState("");
  const [nameTh, setNameTh] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [type, setType] = useState<FacilityType>("MEETING_ROOM");
  const [capacity, setCapacity] = useState(20);
  const [location, setLocation] = useState("");
  const [amenities, setAmenities] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [orderIndex, setOrderIndex] = useState(0);

  // ── Booking Review Handlers ────────────────────────────────────────────
  const openReviewModal = (b: FacilityBookingDto) => {
    setSelectedBooking(b);
    setReviewStatus(b.status === "PENDING" ? "APPROVED" : (b.status as BookingStatus));
    setRejectionReason(b.rejectionReason || "");
    setReviewModalOpen(true);
  };

  const handleSaveReview = () => {
    if (!selectedBooking) return;

    startTransition(async () => {
      const res = await reviewBookingAction({
        id: selectedBooking.id,
        status: reviewStatus,
        rejectionReason: rejectionReason || null,
      });

      if (res.ok) {
        toast.success(t("facilities.review.success"));
        setBookings((prev) => prev.map((b) => (b.id === res.data.id ? res.data : b)));
        setReviewModalOpen(false);
      } else {
        if (res.error.message.includes("OVERLAPPED")) {
          toast.error(t("facilities.error.overlap"));
        } else {
          toast.error(res.error.message);
        }
      }
    });
  };

  // ── Facility CRUD Handlers ─────────────────────────────────────────────
  const openCreateFacility = () => {
    setEditingFacility(null);
    setCode("");
    setNameTh("");
    setNameEn("");
    setType("MEETING_ROOM");
    setCapacity(20);
    setLocation("");
    setAmenities("");
    setIsActive(true);
    setOrderIndex(facilities.length + 1);
    setFacilityModalOpen(true);
  };

  const openEditFacility = (f: FacilityItemDto) => {
    setEditingFacility(f);
    setCode(f.code);
    setNameTh(f.nameTh);
    setNameEn(f.nameEn);
    setType(f.type as FacilityType);
    setCapacity(f.capacity);
    setLocation(f.location);
    setAmenities(f.amenities || "");
    setIsActive(f.isActive);
    setOrderIndex(f.orderIndex);
    setFacilityModalOpen(true);
  };

  const handleSaveFacility = () => {
    if (!code.trim() || !nameTh.trim() || !nameEn.trim() || !location.trim()) {
      toast.error(t("facilities.field.nameTh") + ", " + t("facilities.field.code"));
      return;
    }

    startTransition(async () => {
      const payload = {
        code,
        nameTh,
        nameEn,
        type,
        capacity: Number(capacity),
        location,
        amenities: amenities || null,
        imageUrl: null,
        isActive,
        orderIndex: Number(orderIndex),
      };

      if (editingFacility) {
        const res = await updateFacilityAction({ id: editingFacility.id, ...payload });
        if (res.ok) {
          toast.success(t("common.saved"));
          setFacilities((prev) => prev.map((f) => (f.id === res.data.id ? res.data : f)));
          setFacilityModalOpen(false);
        } else {
          toast.error(res.error.message);
        }
      } else {
        const res = await createFacilityAction(payload);
        if (res.ok) {
          toast.success(t("common.saved"));
          setFacilities((prev) => [res.data, ...prev]);
          setFacilityModalOpen(false);
        } else {
          toast.error(res.error.message);
        }
      }
    });
  };

  const handleDeleteFacility = (f: FacilityItemDto) => {
    startTransition(async () => {
      const res = await deleteFacilityAction(f.id);
      if (res.ok) {
        toast.success(t("common.saved"));
        setFacilities((prev) => prev.filter((i) => i.id !== f.id));
        setDeleteFacilityConfirm(null);
      } else {
        toast.error(res.error.message);
      }
    });
  };

  // Status Pill Tone
  const getBookingStatusTone = (status: string): StatusPillTone => {
    switch (status) {
      case "APPROVED": return "ok";
      case "REJECTED": return "bad";
      case "PENDING": return "warn";
      default: return "off";
    }
  };

  const getBookingStatusLabel = (status: string) => {
    switch (status) {
      case "APPROVED": return t("facilities.status.approved");
      case "REJECTED": return t("facilities.status.rejected");
      case "CANCELLED": return t("facilities.status.cancelled");
      default: return t("facilities.status.pending");
    }
  };

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      !bookingSearch.trim() ||
      b.bookingNumber.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.bookerName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.facilityNameTh.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.purpose.toLowerCase().includes(bookingSearch.toLowerCase());

    const matchesStatus = bookingStatusFilter === "ALL" || b.status === bookingStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Facilities
  const filteredFacilities = facilities.filter((f) => {
    const matchesSearch =
      !facilitySearch.trim() ||
      f.code.toLowerCase().includes(facilitySearch.toLowerCase()) ||
      f.nameTh.toLowerCase().includes(facilitySearch.toLowerCase()) ||
      f.nameEn.toLowerCase().includes(facilitySearch.toLowerCase()) ||
      f.location.toLowerCase().includes(facilitySearch.toLowerCase());

    const matchesType = facilityTypeFilter === "ALL" || f.type === facilityTypeFilter;
    return matchesSearch && matchesType;
  });

  // Booking Columns
  const bookingColumns: DataTableColumn<FacilityBookingDto>[] = [
    {
      key: "number",
      header: t("facilities.booking.number"),
      render: (row: FacilityBookingDto) => (
        <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
          {row.bookingNumber}
        </span>
      ),
    },
    {
      key: "facility",
      header: t("facilities.booking.facility"),
      render: (row: FacilityBookingDto) => (
        <div className="space-y-0.5 text-xs">
          <div className="font-semibold text-foreground">
            {locale === "th" ? row.facilityNameTh : row.facilityNameEn}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {row.facilityLocation}
          </div>
        </div>
      ),
    },
    {
      key: "booker",
      header: t("facilities.booking.bookerName"),
      render: (row: FacilityBookingDto) => (
        <div className="space-y-0.5 text-xs">
          <div className="font-semibold text-foreground">{row.bookerName}</div>
          <div className="text-[11px] text-muted-foreground">
            {row.bookerDept ? `${row.bookerDept} • ` : ""}{row.bookerEmail}
          </div>
        </div>
      ),
    },
    {
      key: "time",
      header: t("facilities.booking.startTime"),
      render: (row: FacilityBookingDto) => (
        <div className="text-xs space-y-0.5">
          <div className="font-medium text-foreground">
            {new Date(row.startTime).toLocaleDateString()}
          </div>
          <div className="text-[11px] text-muted-foreground font-mono">
            {new Date(row.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - {new Date(row.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: t("facilities.booking.status"),
      render: (row: FacilityBookingDto) => (
        <StatusPill tone={getBookingStatusTone(row.status)}>
          {getBookingStatusLabel(row.status)}
        </StatusPill>
      ),
    },
  ];

  // Facility Columns
  const facilityColumns: DataTableColumn<FacilityItemDto>[] = [
    {
      key: "code",
      header: t("facilities.field.code"),
      render: (row: FacilityItemDto) => (
        <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
          {row.code}
        </span>
      ),
    },
    {
      key: "name",
      header: t("facilities.field.nameTh"),
      render: (row: FacilityItemDto) => (
        <div className="space-y-0.5 text-xs">
          <div className="font-semibold text-foreground">
            {locale === "th" ? row.nameTh : row.nameEn}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {row.location}
          </div>
        </div>
      ),
    },
    {
      key: "type",
      header: t("facilities.field.type"),
      render: (row: FacilityItemDto) => (
        <span className="text-xs text-muted-foreground">
          {row.type === "MEETING_ROOM"
            ? t("facilities.type.meetingRoom")
            : row.type === "LAB"
            ? t("facilities.type.lab")
            : row.type === "AUDITORIUM"
            ? t("facilities.type.auditorium")
            : t("facilities.type.vehicle")}
        </span>
      ),
    },
    {
      key: "capacity",
      header: t("facilities.field.capacity"),
      render: (row: FacilityItemDto) => (
        <span className="text-xs font-semibold text-foreground">
          {row.capacity}
        </span>
      ),
    },
    {
      key: "status",
      header: t("facilities.field.status"),
      render: (row: FacilityItemDto) => (
        <StatusPill tone={row.isActive ? "ok" : "off"}>
          {row.isActive ? t("facilities.field.active") : t("facilities.field.inactive")}
        </StatusPill>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span>{t("facilities.title")}</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {t("facilities.subtitle")}
          </p>
        </div>

        {canManage && activeTab === "facilities" && (
          <Button
            onClick={openCreateFacility}
            className="bg-primary text-primary-foreground text-xs flex items-center gap-1.5 px-4 py-2 rounded-xl"
          >
            <Plus className="h-4 w-4" />
            <span>{t("facilities.action.createFacility")}</span>
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("bookings")}
          className={`pb-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "bookings"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Calendar className="h-4 w-4" />
          <span>{t("facilities.tabs.bookings")}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-muted text-[10px] text-muted-foreground">
            {bookings.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("facilities")}
          className={`pb-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "facilities"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>{t("facilities.tabs.rooms")} & {t("facilities.tabs.vehicles")}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-muted text-[10px] text-muted-foreground">
            {facilities.length}
          </span>
        </button>
      </div>

      {/* TAB 1: BOOKINGS */}
      {activeTab === "bookings" && (
        <LiyonCard>
          <div className="p-4 border-b border-border/60 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  placeholder="ค้นหาเลขที่จอง, ผู้จอง, วัตถุประสงค์..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-card border border-border rounded-lg"
                />
              </div>

              <div className="w-36">
                <LiyonSelect
                  value={bookingStatusFilter}
                  onChange={(e) => setBookingStatusFilter(e.target.value)}
                  className="text-xs py-1.5"
                >
                  <option value="ALL">{t("facilities.type.all")}</option>
                  <option value="PENDING">{t("facilities.status.pending")}</option>
                  <option value="APPROVED">{t("facilities.status.approved")}</option>
                  <option value="REJECTED">{t("facilities.status.rejected")}</option>
                </LiyonSelect>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              {filteredBookings.length} {locale === "th" ? "รายการ" : "bookings"}
            </div>
          </div>

          <DataTable
            state={filteredBookings.length ? "data" : "empty"}
            headHeading={<h3 className="text-base font-semibold">{t("facilities.tabs.bookings")}</h3>}
            columns={bookingColumns}
            rows={filteredBookings}
            getRowId={(r: FacilityBookingDto) => r.id}
            renderRowMenu={
              canManage
                ? (r: FacilityBookingDto) => (
                    <RowMenuItem onSelect={() => openReviewModal(r)}>
                      <Clock className="h-3.5 w-3.5 mr-2" />
                      <span>{t("facilities.action.approve")} / {t("facilities.action.reject")}</span>
                    </RowMenuItem>
                  )
                : undefined
            }
            empty={{
              icon: <Calendar className="h-8 w-8 text-muted-foreground" />,
              title: t("facilities.empty"),
              description: t("facilities.subtitle"),
            }}
            error={{
              icon: <Calendar className="h-8 w-8 text-destructive" />,
              title: t("common.error"),
            }}
          />
        </LiyonCard>
      )}

      {/* TAB 2: FACILITIES */}
      {activeTab === "facilities" && (
        <LiyonCard>
          <div className="p-4 border-b border-border/60 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={facilitySearch}
                  onChange={(e) => setFacilitySearch(e.target.value)}
                  placeholder="ค้นหารหัส, ชื่อห้อง, สถานที่..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-card border border-border rounded-lg"
                />
              </div>

              <div className="w-44">
                <LiyonSelect
                  value={facilityTypeFilter}
                  onChange={(e) => setFacilityTypeFilter(e.target.value)}
                  className="text-xs py-1.5"
                >
                  <option value="ALL">{t("facilities.type.all")}</option>
                  <option value="MEETING_ROOM">{t("facilities.type.meetingRoom")}</option>
                  <option value="LAB">{t("facilities.type.lab")}</option>
                  <option value="AUDITORIUM">{t("facilities.type.auditorium")}</option>
                  <option value="VEHICLE">{t("facilities.type.vehicle")}</option>
                </LiyonSelect>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              {filteredFacilities.length} {locale === "th" ? "รายการ" : "items"}
            </div>
          </div>

          <DataTable
            state={filteredFacilities.length ? "data" : "empty"}
            headHeading={<h3 className="text-base font-semibold">{t("facilities.tabs.rooms")}</h3>}
            columns={facilityColumns}
            rows={filteredFacilities}
            getRowId={(r: FacilityItemDto) => r.id}
            renderRowMenu={
              canManage
                ? (r: FacilityItemDto) => (
                    <>
                      <RowMenuItem onSelect={() => openEditFacility(r)}>
                        <Edit2 className="h-3.5 w-3.5 mr-2" />
                        <span>{t("facilities.action.editFacility")}</span>
                      </RowMenuItem>
                      <RowMenuItem danger onSelect={() => setDeleteFacilityConfirm(r)}>
                        <Trash2 className="h-3.5 w-3.5 mr-2 text-destructive" />
                        <span className="text-destructive">{t("facilities.action.deleteFacility")}</span>
                      </RowMenuItem>
                    </>
                  )
                : undefined
            }
            empty={{
              icon: <Building2 className="h-8 w-8 text-muted-foreground" />,
              title: t("facilities.empty"),
              description: t("facilities.subtitle"),
            }}
            error={{
              icon: <Building2 className="h-8 w-8 text-destructive" />,
              title: t("common.error"),
            }}
          />
        </LiyonCard>
      )}

      {/* Review Booking Modal */}
      <LiyonDialog open={reviewModalOpen} onOpenChange={setReviewModalOpen} wide>
        <LiyonDialogCloseButton label={locale === "th" ? "ปิด" : "Close"} />
        <LiyonDialogHeader
          title={t("facilities.action.approve") + " / " + t("facilities.action.reject")}
          description={selectedBooking?.bookingNumber}
        />

        {selectedBooking && (
          <LiyonDialogBody className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 text-xs">
            <div className="p-4 bg-muted/20 border border-border/50 rounded-2xl space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <span className="text-muted-foreground">{t("facilities.booking.facility")}:</span>{" "}
                  <span className="font-semibold text-foreground">{selectedBooking.facilityNameTh} ({selectedBooking.facilityLocation})</span>
                </div>
                <div>
                  <span className="text-muted-foreground">{t("facilities.booking.bookerName")}:</span>{" "}
                  <span className="font-semibold text-foreground">{selectedBooking.bookerName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">{t("facilities.booking.startTime")}:</span>{" "}
                  <span className="font-semibold text-foreground font-mono">
                    {new Date(selectedBooking.startTime).toLocaleString()} - {new Date(selectedBooking.endTime).toLocaleTimeString()}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">{t("facilities.booking.attendeeCount")}:</span>{" "}
                  <span className="font-semibold text-foreground">{selectedBooking.attendeeCount}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-muted-foreground">{t("facilities.booking.purpose")}:</span>
              <p className="bg-background p-3 rounded-xl border border-border text-foreground">
                {selectedBooking.purpose}
              </p>
            </div>

            <div className="border-t border-border pt-4 space-y-4">
              <LiyonField label={t("facilities.booking.status")} htmlFor="revBookingStatus">
                <LiyonSelect
                  id="revBookingStatus"
                  value={reviewStatus}
                  onChange={(e) => setReviewStatus(e.target.value as BookingStatus)}
                  className="text-xs"
                >
                  <option value="APPROVED">{t("facilities.status.approved")}</option>
                  <option value="REJECTED">{t("facilities.status.rejected")}</option>
                  <option value="PENDING">{t("facilities.status.pending")}</option>
                </LiyonSelect>
              </LiyonField>

              {reviewStatus === "REJECTED" && (
                <LiyonField label="เหตุผลที่ปฏิเสธการจอง" htmlFor="rejReason">
                  <input
                    id="rejReason"
                    type="text"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="เช่น ห้องปิดปรับปรุงระบบ หรือ ติดภารกิจคณะ"
                    className="w-full px-3 py-1.5 text-xs bg-background border border-border rounded-lg"
                  />
                </LiyonField>
              )}
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
            {t("common.saved")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>

      {/* Facility Create/Edit Modal */}
      <LiyonDialog open={facilityModalOpen} onOpenChange={setFacilityModalOpen} wide>
        <LiyonDialogCloseButton label={locale === "th" ? "ปิด" : "Close"} />
        <LiyonDialogHeader
          title={editingFacility ? t("facilities.action.editFacility") : t("facilities.action.createFacility")}
          description={editingFacility ? editingFacility.nameTh : t("facilities.subtitle")}
        />

        <LiyonDialogBody className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LiyonField label={t("facilities.field.code")} htmlFor="fCode">
              <input
                id="fCode"
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="เช่น CR-301 หรือ VAN-01"
                className="w-full px-3 py-1.5 text-xs bg-background border border-border rounded-lg"
              />
            </LiyonField>

            <LiyonField label={t("facilities.field.type")} htmlFor="fType">
              <LiyonSelect
                id="fType"
                value={type}
                onChange={(e) => setType(e.target.value as FacilityType)}
                className="text-xs"
              >
                <option value="MEETING_ROOM">{t("facilities.type.meetingRoom")}</option>
                <option value="LAB">{t("facilities.type.lab")}</option>
                <option value="AUDITORIUM">{t("facilities.type.auditorium")}</option>
                <option value="VEHICLE">{t("facilities.type.vehicle")}</option>
              </LiyonSelect>
            </LiyonField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LiyonField label={t("facilities.field.nameTh")} htmlFor="fNameTh">
              <input
                id="fNameTh"
                type="text"
                required
                value={nameTh}
                onChange={(e) => setNameTh(e.target.value)}
                placeholder="เช่น ห้องประชุมสุรนารี 1"
                className="w-full px-3 py-1.5 text-xs bg-background border border-border rounded-lg"
              />
            </LiyonField>

            <LiyonField label={t("facilities.field.nameEn")} htmlFor="fNameEn">
              <input
                id="fNameEn"
                type="text"
                required
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Suranaree Conference Room 1"
                className="w-full px-3 py-1.5 text-xs bg-background border border-border rounded-lg"
              />
            </LiyonField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LiyonField label={t("facilities.field.location")} htmlFor="fLocation">
              <input
                id="fLocation"
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="เช่น อาคาร 1 ชั้น 3 หรือ ทะเบียน ฮบ-1234 กทม."
                className="w-full px-3 py-1.5 text-xs bg-background border border-border rounded-lg"
              />
            </LiyonField>

            <LiyonField label={t("facilities.field.capacity")} htmlFor="fCapacity">
              <input
                id="fCapacity"
                type="number"
                min={1}
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs bg-background border border-border rounded-lg"
              />
            </LiyonField>
          </div>

          <LiyonField label={t("facilities.field.amenities")} htmlFor="fAmenities">
            <input
              id="fAmenities"
              type="text"
              value={amenities}
              onChange={(e) => setAmenities(e.target.value)}
              placeholder="เช่น Projector 4K, Video Conference, Whiteboard, ไมโครโฟนไร้สาย (คั่นด้วยจุลภาค)"
              className="w-full px-3 py-1.5 text-xs bg-background border border-border rounded-lg"
            />
          </LiyonField>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="facilityActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor="facilityActive" className="text-xs font-medium text-foreground cursor-pointer">
              {t("facilities.field.active")}
            </label>
          </div>
        </LiyonDialogBody>

        <LiyonDialogFooter>
          <Button
            variant="outline"
            onClick={() => setFacilityModalOpen(false)}
            disabled={isPending}
            className="text-xs"
          >
            {locale === "th" ? "ยกเลิก" : "Cancel"}
          </Button>
          <Button
            onClick={handleSaveFacility}
            disabled={isPending}
            className="bg-primary text-primary-foreground text-xs"
          >
            {t("common.saved")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>

      {/* Delete Facility Modal */}
      <LiyonDialog
        open={!!deleteFacilityConfirm}
        onOpenChange={(open) => !open && setDeleteFacilityConfirm(null)}
        danger
      >
        <LiyonDialogCloseButton label={locale === "th" ? "ปิด" : "Close"} />
        <LiyonDialogHeader
          title={t("facilities.action.deleteFacility")}
          description="การกระทำนี้จะลบห้องหรือยานพาหนะนี้ออกจากระบบอย่างถาวร"
        />
        <LiyonDialogBody>
          {deleteFacilityConfirm && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-xs font-medium text-foreground">
              {deleteFacilityConfirm.nameTh} ({deleteFacilityConfirm.code})
            </div>
          )}
        </LiyonDialogBody>
        <LiyonDialogFooter>
          <Button
            variant="outline"
            onClick={() => setDeleteFacilityConfirm(null)}
            disabled={isPending}
            className="text-xs"
          >
            {locale === "th" ? "ยกเลิก" : "Cancel"}
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteFacilityConfirm && handleDeleteFacility(deleteFacilityConfirm)}
            disabled={isPending}
            className="text-xs"
          >
            {t("facilities.action.deleteFacility")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>
    </div>
  );
}
