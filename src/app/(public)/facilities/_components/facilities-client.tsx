"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useT, useLocale } from "@/shared/lib/i18n/client";
import {
  Building2,
  Users,
  MapPin,
  Calendar,
  Car,
  Laptop,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import {
  LiyonDialog,
  LiyonDialogHeader,
  LiyonDialogBody,
  LiyonDialogFooter,
  LiyonDialogCloseButton,
  LiyonField,
} from "@/shared/components/liyon";
import { Button } from "@/components/ui/button";
import type {
  FacilityItemDto,
  FacilityBookingDto,
} from "@/features/facilities";
import { createBookingAction } from "@/features/facilities/actions";

interface Props {
  facilities: FacilityItemDto[];
}

export function FacilitiesClient({ facilities }: Props) {
  const t = useT();
  const locale = useLocale();

  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [isPending, startTransition] = useTransition();

  // Booking Modal
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<FacilityItemDto | null>(null);
  const [bookerName, setBookerName] = useState("");
  const [bookerEmail, setBookerEmail] = useState("");
  const [bookerPhone, setBookerPhone] = useState("");
  const [bookerDept, setBookerDept] = useState("");
  const [purpose, setPurpose] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [attendeeCount, setAttendeeCount] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState<FacilityBookingDto | null>(null);

  const openBookModal = (facility: FacilityItemDto) => {
    setSelectedFacility(facility);
    setBookingSuccess(null);
    setBookerName("");
    setBookerEmail("");
    setBookerPhone("");
    setBookerDept("");
    setPurpose("");
    setAttendeeCount(Math.min(5, facility.capacity));

    // Default dates: tomorrow 09:00 - 12:00
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];
    setStartTime(`${dateStr}T09:00`);
    setEndTime(`${dateStr}T12:00`);

    setBookingModalOpen(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFacility) return;
    if (!bookerName.trim() || !bookerEmail.trim() || !purpose.trim() || !startTime || !endTime) {
      toast.error(t("facilities.booking.purpose") + ", " + t("facilities.booking.bookerName"));
      return;
    }

    if (new Date(endTime) <= new Date(startTime)) {
      toast.error(t("facilities.error.timeInvalid"));
      return;
    }

    startTransition(async () => {
      const res = await createBookingAction({
        facilityId: selectedFacility.id,
        bookerName,
        bookerEmail,
        bookerPhone: bookerPhone || null,
        bookerDept: bookerDept || null,
        purpose,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        attendeeCount: Number(attendeeCount),
      });

      if (res.ok) {
        toast.success(t("facilities.book.success"));
        setBookingSuccess(res.data);
      } else {
        if (res.error.message.includes("OVERLAPPED")) {
          toast.error(t("facilities.error.overlap"));
        } else {
          toast.error(res.error.message);
        }
      }
    });
  };

  const filteredFacilities = facilities.filter((f) => {
    if (selectedType === "ALL") return true;
    return f.type === selectedType;
  });

  const typeTabs = [
    { id: "ALL", label: t("facilities.type.all") },
    { id: "MEETING_ROOM", label: t("facilities.type.meetingRoom") },
    { id: "LAB", label: t("facilities.type.lab") },
    { id: "AUDITORIUM", label: t("facilities.type.auditorium") },
    { id: "VEHICLE", label: t("facilities.type.vehicle") },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Banner */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Room & Vehicle Reservation System</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          {t("facilities.publicTitle")}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          {t("facilities.publicSubtitle")}
        </p>
      </div>

      {/* Type Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-border pb-4">
        {typeTabs.map((tab) => {
          const isActive = selectedType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Facilities Grid */}
      {filteredFacilities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFacilities.map((f) => {
            const name = locale === "th" ? f.nameTh : f.nameEn;
            const isVehicle = f.type === "VEHICLE";

            return (
              <div
                key={f.id}
                className="group relative flex flex-col bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:border-primary/40"
              >
                {/* Header card info */}
                <div className="p-6 pb-4 border-b border-border/60 bg-muted/20 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary flex items-center gap-1.5">
                      {isVehicle ? <Car className="h-3 w-3" /> : f.type === "LAB" ? <Laptop className="h-3 w-3" /> : <Building2 className="h-3 w-3" />}
                      <span>
                        {f.type === "MEETING_ROOM"
                          ? t("facilities.type.meetingRoom")
                          : f.type === "LAB"
                          ? t("facilities.type.lab")
                          : f.type === "AUDITORIUM"
                          ? t("facilities.type.auditorium")
                          : t("facilities.type.vehicle")}
                      </span>
                    </span>
                    <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {f.code}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                    {name}
                  </h2>
                </div>

                {/* Body details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-foreground">{f.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4 text-primary shrink-0" />
                      <span>
                        {t("facilities.field.capacity")}: <strong className="text-foreground">{f.capacity}</strong> {locale === "th" ? (isVehicle ? "ที่นั่ง" : "คน") : "seats"}
                      </span>
                    </div>

                    {f.amenities && (
                      <div className="pt-2 text-xs text-muted-foreground border-t border-border/60">
                        <span className="font-semibold text-foreground block mb-1">
                          {t("facilities.field.amenities")}:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {f.amenities.split(",").map((a, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-muted rounded-md text-[11px]"
                            >
                              {a.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3">
                    <Button
                      onClick={() => openBookModal(f)}
                      className="w-full bg-primary text-primary-foreground text-xs py-2 rounded-xl flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{t("facilities.action.book")}</span>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-card border border-border rounded-2xl text-xs text-muted-foreground space-y-2">
          <Building2 className="h-10 w-10 text-muted-foreground mx-auto stroke-1" />
          <p>{t("facilities.empty")}</p>
        </div>
      )}

      {/* Booking Dialog */}
      <LiyonDialog open={bookingModalOpen} onOpenChange={setBookingModalOpen} wide>
        <LiyonDialogCloseButton label={locale === "th" ? "ปิด" : "Close"} />
        <LiyonDialogHeader
          title={t("facilities.action.book")}
          description={selectedFacility ? (locale === "th" ? selectedFacility.nameTh : selectedFacility.nameEn) : ""}
        />

        {bookingSuccess ? (
          <LiyonDialogBody className="space-y-6 text-center py-6">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground">
                {t("facilities.book.success")}
              </h3>
              <p className="text-xs text-muted-foreground">
                {locale === "th"
                  ? "ระบบได้รับคำขอจองของท่านแล้ว และส่งข้อมูลไปยังผู้ดูแลเพื่อทำการอนุมัติ"
                  : "Your reservation has been received and queued for review."}
              </p>
            </div>

            <div className="p-4 bg-muted/40 border border-border rounded-2xl max-w-sm mx-auto space-y-1">
              <span className="text-xs text-muted-foreground uppercase font-semibold">
                {t("facilities.booking.number")}
              </span>
              <div className="text-2xl font-mono font-black text-primary select-all">
                {bookingSuccess.bookingNumber}
              </div>
            </div>

            <div className="pt-2">
              <Button
                onClick={() => setBookingModalOpen(false)}
                className="bg-primary text-primary-foreground text-xs px-8"
              >
                {locale === "th" ? "เสร็จสิ้น" : "Done"}
              </Button>
            </div>
          </LiyonDialogBody>
        ) : (
          <form onSubmit={handleBookingSubmit}>
            <LiyonDialogBody className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <LiyonField label={t("facilities.booking.bookerName")} htmlFor="bName">
                  <input
                    id="bName"
                    type="text"
                    required
                    value={bookerName}
                    onChange={(e) => setBookerName(e.target.value)}
                    placeholder="เช่น อาจารย์ หรือ นักศึกษาผู้ขอใช้"
                    className="w-full px-3 py-1.5 text-xs bg-background border border-border rounded-lg"
                  />
                </LiyonField>

                <LiyonField label={t("facilities.booking.bookerEmail")} htmlFor="bEmail">
                  <input
                    id="bEmail"
                    type="email"
                    required
                    value={bookerEmail}
                    onChange={(e) => setBookerEmail(e.target.value)}
                    placeholder="name@mail.kmutt.ac.th"
                    className="w-full px-3 py-1.5 text-xs bg-background border border-border rounded-lg"
                  />
                </LiyonField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <LiyonField label={t("facilities.booking.bookerPhone")} htmlFor="bPhone">
                  <input
                    id="bPhone"
                    type="text"
                    value={bookerPhone}
                    onChange={(e) => setBookerPhone(e.target.value)}
                    placeholder="081-234-5678"
                    className="w-full px-3 py-1.5 text-xs bg-background border border-border rounded-lg"
                  />
                </LiyonField>

                <LiyonField label={t("facilities.booking.bookerDept")} htmlFor="bDept">
                  <input
                    id="bDept"
                    type="text"
                    value={bookerDept}
                    onChange={(e) => setBookerDept(e.target.value)}
                    placeholder="เช่น สาขาวิชาวิศวกรรมคอมพิวเตอร์"
                    className="w-full px-3 py-1.5 text-xs bg-background border border-border rounded-lg"
                  />
                </LiyonField>
              </div>

              <LiyonField label={t("facilities.booking.purpose")} htmlFor="bPurpose">
                <textarea
                  id="bPurpose"
                  rows={3}
                  required
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="เช่น ประชุมคณะกรรมการบริหารหลักสูตร หรือ สอบวิทยานิพนธ์"
                  className="w-full px-3 py-1.5 text-xs bg-background border border-border rounded-lg"
                />
              </LiyonField>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <LiyonField label={t("facilities.booking.startTime")} htmlFor="bStart">
                  <input
                    id="bStart"
                    type="datetime-local"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-background border border-border rounded-lg"
                  />
                </LiyonField>

                <LiyonField label={t("facilities.booking.endTime")} htmlFor="bEnd">
                  <input
                    id="bEnd"
                    type="datetime-local"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-background border border-border rounded-lg"
                  />
                </LiyonField>

                <LiyonField label={t("facilities.booking.attendeeCount")} htmlFor="bCount">
                  <input
                    id="bCount"
                    type="number"
                    min={1}
                    max={selectedFacility?.capacity || 100}
                    value={attendeeCount}
                    onChange={(e) => setAttendeeCount(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs bg-background border border-border rounded-lg"
                  />
                </LiyonField>
              </div>
            </LiyonDialogBody>

            <LiyonDialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setBookingModalOpen(false)}
                disabled={isPending}
                className="text-xs"
              >
                {locale === "th" ? "ยกเลิก" : "Cancel"}
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-primary text-primary-foreground text-xs"
              >
                {t("facilities.action.book")}
              </Button>
            </LiyonDialogFooter>
          </form>
        )}
      </LiyonDialog>
    </div>
  );
}
