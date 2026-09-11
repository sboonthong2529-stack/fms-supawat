"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Users, Building, Search, Award } from "lucide-react";
import { toast } from "sonner";
import { useT, useLocale } from "@/shared/lib/i18n/client";
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
} from "@/shared/components/liyon";
import { Button } from "@/components/ui/button";
import type {
  PersonnelProfileDto,
  AcademicDepartmentDto,
  PositionTypeValue,
} from "@/features/personnel";
import {
  createPersonnelAction,
  updatePersonnelAction,
  deletePersonnelAction,
  createDepartmentAction,
  updateDepartmentAction,
  deleteDepartmentAction,
} from "@/features/personnel/actions";

interface Props {
  initialPersonnel: PersonnelProfileDto[];
  initialDepartments: AcademicDepartmentDto[];
  canManage: boolean;
}

export function PersonnelClient({
  initialPersonnel,
  initialDepartments,
  canManage,
}: Props) {
  const t = useT();
  const locale = useLocale();

  const [activeTab, setActiveTab] = useState<"staff" | "departments">("staff");
  const [personnelList, setPersonnelList] = useState<PersonnelProfileDto[]>(initialPersonnel);
  const [departments, setDepartments] = useState<AcademicDepartmentDto[]>(initialDepartments);
  const [isPending, startTransition] = useTransition();

  // Filters for Personnel
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");

  // Personnel Modal States
  const [personnelModalOpen, setPersonnelModalOpen] = useState(false);
  const [editingPersonnel, setEditingPersonnel] = useState<PersonnelProfileDto | null>(null);
  const [deleteConfirmPersonnel, setDeleteConfirmPersonnel] = useState<PersonnelProfileDto | null>(null);

  // Personnel Form State
  const [academicTitle, setAcademicTitle] = useState("");
  const [firstNameTh, setFirstNameTh] = useState("");
  const [lastNameTh, setLastNameTh] = useState("");
  const [firstNameEn, setFirstNameEn] = useState("");
  const [lastNameEn, setLastNameEn] = useState("");
  const [departmentId, setDepartmentId] = useState<string>("");
  const [positionType, setPositionType] = useState<PositionTypeValue>("ACADEMIC");
  const [isExecutive, setIsExecutive] = useState(false);
  const [executivePositionTh, setExecutivePositionTh] = useState("");
  const [executivePositionEn, setExecutivePositionEn] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [officeRoom, setOfficeRoom] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [researchInterests, setResearchInterests] = useState("");
  const [orderIndex, setOrderIndex] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // Department Modal States
  const [deptModalOpen, setDeptModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<AcademicDepartmentDto | null>(null);
  const [deleteConfirmDept, setDeleteConfirmDept] = useState<AcademicDepartmentDto | null>(null);

  // Department Form State
  const [deptCode, setDeptCode] = useState("");
  const [deptNameTh, setDeptNameTh] = useState("");
  const [deptNameEn, setDeptNameEn] = useState("");
  const [deptOrderIndex, setDeptOrderIndex] = useState(0);

  // ── Personnel Dialog Handlers ──────────────────────────────────────────
  const openCreatePersonnel = () => {
    setEditingPersonnel(null);
    setAcademicTitle("");
    setFirstNameTh("");
    setLastNameTh("");
    setFirstNameEn("");
    setLastNameEn("");
    setDepartmentId(departments[0]?.id ?? "");
    setPositionType("ACADEMIC");
    setIsExecutive(false);
    setExecutivePositionTh("");
    setExecutivePositionEn("");
    setEmail("");
    setPhone("");
    setOfficeRoom("");
    setAvatarUrl("");
    setResearchInterests("");
    setOrderIndex(0);
    setIsActive(true);
    setPersonnelModalOpen(true);
  };

  const openEditPersonnel = (p: PersonnelProfileDto) => {
    setEditingPersonnel(p);
    setAcademicTitle(p.academicTitle ?? "");
    setFirstNameTh(p.firstNameTh);
    setLastNameTh(p.lastNameTh);
    setFirstNameEn(p.firstNameEn);
    setLastNameEn(p.lastNameEn);
    setDepartmentId(p.departmentId ?? "");
    setPositionType(p.positionType);
    setIsExecutive(p.isExecutive);
    setExecutivePositionTh(p.executivePositionTh ?? "");
    setExecutivePositionEn(p.executivePositionEn ?? "");
    setEmail(p.email ?? "");
    setPhone(p.phone ?? "");
    setOfficeRoom(p.officeRoom ?? "");
    setAvatarUrl(p.avatarUrl ?? "");
    setResearchInterests(p.researchInterests ?? "");
    setOrderIndex(p.orderIndex);
    setIsActive(p.isActive);
    setPersonnelModalOpen(true);
  };

  const handleSavePersonnel = () => {
    if (!firstNameTh.trim() || !lastNameTh.trim() || !firstNameEn.trim() || !lastNameEn.trim()) {
      toast.error(t("personnel.nameTh") + " / " + t("personnel.nameEn"));
      return;
    }

    startTransition(async () => {
      if (editingPersonnel) {
        const res = await updatePersonnelAction({
          id: editingPersonnel.id,
          academicTitle: academicTitle || undefined,
          firstNameTh,
          lastNameTh,
          firstNameEn,
          lastNameEn,
          departmentId: departmentId || undefined,
          positionType,
          isExecutive,
          executivePositionTh: executivePositionTh || undefined,
          executivePositionEn: executivePositionEn || undefined,
          email: email || undefined,
          phone: phone || undefined,
          officeRoom: officeRoom || undefined,
          avatarUrl: avatarUrl || undefined,
          researchInterests: researchInterests || undefined,
          orderIndex,
          isActive,
        });

        if (res.ok) {
          toast.success(t("personnel.updateSuccess"));
          setPersonnelList((prev) => prev.map((item) => (item.id === res.data.id ? res.data : item)));
          setPersonnelModalOpen(false);
        } else {
          toast.error(res.error.message);
        }
      } else {
        const res = await createPersonnelAction({
          academicTitle: academicTitle || undefined,
          firstNameTh,
          lastNameTh,
          firstNameEn,
          lastNameEn,
          departmentId: departmentId || undefined,
          positionType,
          isExecutive,
          executivePositionTh: executivePositionTh || undefined,
          executivePositionEn: executivePositionEn || undefined,
          email: email || undefined,
          phone: phone || undefined,
          officeRoom: officeRoom || undefined,
          avatarUrl: avatarUrl || undefined,
          researchInterests: researchInterests || undefined,
          orderIndex,
          isActive,
        });

        if (res.ok) {
          toast.success(t("personnel.createSuccess"));
          setPersonnelList((prev) => [res.data, ...prev]);
          setPersonnelModalOpen(false);
        } else {
          toast.error(res.error.message);
        }
      }
    });
  };

  const handleDeletePersonnel = (p: PersonnelProfileDto) => {
    startTransition(async () => {
      const res = await deletePersonnelAction(p.id);
      if (res.ok) {
        toast.success(t("personnel.deleteSuccess"));
        setPersonnelList((prev) => prev.filter((i) => i.id !== p.id));
        setDeleteConfirmPersonnel(null);
      } else {
        toast.error(res.error.message);
      }
    });
  };

  // ── Department Dialog Handlers ─────────────────────────────────────────
  const openCreateDept = () => {
    setEditingDept(null);
    setDeptCode("");
    setDeptNameTh("");
    setDeptNameEn("");
    setDeptOrderIndex(departments.length + 1);
    setDeptModalOpen(true);
  };

  const openEditDept = (d: AcademicDepartmentDto) => {
    setEditingDept(d);
    setDeptCode(d.code);
    setDeptNameTh(d.nameTh);
    setDeptNameEn(d.nameEn);
    setDeptOrderIndex(d.orderIndex);
    setDeptModalOpen(true);
  };

  const handleSaveDept = () => {
    if (!deptCode.trim() || !deptNameTh.trim() || !deptNameEn.trim()) {
      toast.error(t("department.code") + ", " + t("department.nameTh"));
      return;
    }

    startTransition(async () => {
      if (editingDept) {
        const res = await updateDepartmentAction({
          id: editingDept.id,
          code: deptCode,
          nameTh: deptNameTh,
          nameEn: deptNameEn,
          orderIndex: deptOrderIndex,
        });

        if (res.ok) {
          toast.success(t("department.updateSuccess"));
          setDepartments((prev) => prev.map((d) => (d.id === res.data.id ? { ...res.data, personnelCount: d.personnelCount } : d)));
          setDeptModalOpen(false);
        } else {
          toast.error(res.error.message);
        }
      } else {
        const res = await createDepartmentAction({
          code: deptCode,
          nameTh: deptNameTh,
          nameEn: deptNameEn,
          orderIndex: deptOrderIndex,
        });

        if (res.ok) {
          toast.success(t("department.createSuccess"));
          setDepartments((prev) => [...prev, { ...res.data, personnelCount: 0 }]);
          setDeptModalOpen(false);
        } else {
          toast.error(res.error.message);
        }
      }
    });
  };

  const handleDeleteDept = (d: AcademicDepartmentDto) => {
    startTransition(async () => {
      const res = await deleteDepartmentAction(d.id);
      if (res.ok) {
        toast.success(t("department.deleteSuccess"));
        setDepartments((prev) => prev.filter((i) => i.id !== d.id));
        setDeleteConfirmDept(null);
      } else {
        toast.error(res.error.message);
      }
    });
  };

  // Filter Personnel
  const filteredPersonnel = personnelList.filter((p) => {
    if (selectedDept !== "ALL" && p.departmentId !== selectedDept) return false;
    if (selectedType !== "ALL" && p.positionType !== selectedType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTh = p.fullNameTh.toLowerCase().includes(q);
      const matchEn = p.fullNameEn.toLowerCase().includes(q);
      const matchEmail = p.email?.toLowerCase().includes(q);
      const matchResearch = p.researchInterests?.toLowerCase().includes(q);
      if (!matchTh && !matchEn && !matchEmail && !matchResearch) return false;
    }
    return true;
  });

  const personnelColumns: DataTableColumn<PersonnelProfileDto>[] = [
    {
      key: "name",
      header: t("personnel.nameTh"),
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full overflow-hidden bg-muted flex items-center justify-center font-bold text-xs text-primary flex-shrink-0">
            {row.avatarUrl ? (
              <Image src={row.avatarUrl} alt={row.fullNameTh} width={36} height={36} className="h-full w-full object-cover" unoptimized />
            ) : (
              row.firstNameTh.charAt(0)
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-foreground">{row.fullNameTh}</span>
              {row.isExecutive && (
                <span className="inline-flex items-center gap-0.5 rounded bg-primary/10 px-1.5 py-0.2 text-[10px] font-bold text-primary">
                  <Award className="h-3 w-3" />
                  {row.executivePositionTh || t("personnel.tabExecutives")}
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">{row.fullNameEn}</span>
          </div>
        </div>
      ),
    },
    {
      key: "department",
      header: t("personnel.department"),
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {locale === "th" ? row.departmentNameTh || "—" : row.departmentNameEn || "—"}
        </span>
      ),
    },
    {
      key: "type",
      header: t("personnel.positionType"),
      render: (row) => (
        <span className="inline-block rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {row.positionType === "ACADEMIC"
            ? t("personnel.positionType.academic")
            : t("personnel.positionType.support")}
        </span>
      ),
    },
    {
      key: "contact",
      header: t("personnel.portal.contact"),
      render: (row) => (
        <div className="text-xs space-y-0.5 text-muted-foreground">
          <div>{row.email || "—"}</div>
          {row.officeRoom && <div className="text-[11px] opacity-80">{row.officeRoom}</div>}
        </div>
      ),
    },
    {
      key: "order",
      header: t("personnel.orderIndex"),
      render: (row) => <span className="font-mono text-xs text-muted-foreground">{row.orderIndex}</span>,
    },
    {
      key: "status",
      header: t("personnel.isActive"),
      render: (row) => (
        <StatusPill tone={row.isActive ? "ok" : "off"}>
          {row.isActive ? t("status.active") : t("status.inactive")}
        </StatusPill>
      ),
    },
  ];

  const departmentColumns: DataTableColumn<AcademicDepartmentDto>[] = [
    {
      key: "code",
      header: t("department.code"),
      render: (row) => <span className="font-mono font-bold text-sm text-foreground">{row.code}</span>,
    },
    {
      key: "nameTh",
      header: t("department.nameTh"),
      render: (row) => <span className="font-medium text-foreground">{row.nameTh}</span>,
    },
    {
      key: "nameEn",
      header: t("department.nameEn"),
      render: (row) => <span className="text-xs text-muted-foreground">{row.nameEn}</span>,
    },
    {
      key: "count",
      header: t("personnel.tabStaff"),
      render: (row) => (
        <span className="text-xs font-mono rounded bg-muted px-2 py-0.5 text-muted-foreground">
          {row.personnelCount ?? 0} {locale === "th" ? "ท่าน" : "members"}
        </span>
      ),
    },
    {
      key: "order",
      header: t("personnel.orderIndex"),
      render: (row) => <span className="font-mono text-xs text-muted-foreground">{row.orderIndex}</span>,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("personnel.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("personnel.subtitle")}</p>
        </div>
        {canManage && (
          <div className="flex items-center gap-2">
            {activeTab === "staff" ? (
              <Button onClick={openCreatePersonnel} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {t("personnel.create")}
              </Button>
            ) : (
              <Button onClick={openCreateDept} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {t("department.create")}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("staff")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
            activeTab === "staff"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Users className="h-4 w-4" />
          <span>{t("personnel.tabStaff")}</span>
          <span className="rounded-full bg-background/20 px-1.5 py-0.2 text-xs">
            {personnelList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("departments")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
            activeTab === "departments"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Building className="h-4 w-4" />
          <span>{t("personnel.tabDepts")}</span>
          <span className="rounded-full bg-background/20 px-1.5 py-0.2 text-xs">
            {departments.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Personnel Table */}
      {activeTab === "staff" && (
        <LiyonCard>
          <div className="p-4 border-b border-border flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-1 items-center gap-3 min-w-[280px]">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("personnel.portal.searchPlaceholder")}
                  className="w-full pl-9 pr-3 py-1.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <LiyonSelect
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="text-sm py-1.5"
              >
                <option value="ALL">{t("personnel.portal.allDepartments")}</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {locale === "th" ? d.nameTh : d.nameEn}
                  </option>
                ))}
              </LiyonSelect>

              <LiyonSelect
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="text-sm py-1.5"
              >
                <option value="ALL">{t("common.all")}</option>
                <option value="ACADEMIC">{t("personnel.positionType.academic")}</option>
                <option value="SUPPORT">{t("personnel.positionType.support")}</option>
              </LiyonSelect>
            </div>
          </div>

          <DataTable
            state={filteredPersonnel.length ? "data" : "empty"}
            headHeading={t("personnel.tabStaff")}
            columns={personnelColumns}
            rows={filteredPersonnel}
            getRowId={(row) => row.id}
            renderRowMenu={
              canManage
                ? (row) => (
                    <>
                      <RowMenuItem onSelect={() => openEditPersonnel(row)} icon={<Edit2 className="h-4 w-4" />}>
                        {t("personnel.edit")}
                      </RowMenuItem>
                      <RowMenuItem danger onSelect={() => setDeleteConfirmPersonnel(row)} icon={<Trash2 className="h-4 w-4" />}>
                        {t("personnel.delete")}
                      </RowMenuItem>
                    </>
                  )
                : undefined
            }
            empty={{
              icon: <Users className="h-8 w-8 text-muted-foreground" />,
              title: t("personnel.empty"),
              description: t("personnel.subtitle"),
            }}
            error={{
              icon: <Users className="h-8 w-8 text-destructive" />,
              title: t("common.error"),
            }}
          />
        </LiyonCard>
      )}

      {/* Tab 2: Departments Table */}
      {activeTab === "departments" && (
        <LiyonCard>
          <DataTable
            state={departments.length ? "data" : "empty"}
            headHeading={t("personnel.tabDepts")}
            columns={departmentColumns}
            rows={departments}
            getRowId={(row) => row.id}
            renderRowMenu={
              canManage
                ? (row) => (
                    <>
                      <RowMenuItem onSelect={() => openEditDept(row)} icon={<Edit2 className="h-4 w-4" />}>
                        {t("department.edit")}
                      </RowMenuItem>
                      <RowMenuItem danger onSelect={() => setDeleteConfirmDept(row)} icon={<Trash2 className="h-4 w-4" />}>
                        {t("department.delete")}
                      </RowMenuItem>
                    </>
                  )
                : undefined
            }
            empty={{
              icon: <Building className="h-8 w-8 text-muted-foreground" />,
              title: t("personnel.empty"),
              description: t("personnel.subtitle"),
            }}
            error={{
              icon: <Building className="h-8 w-8 text-destructive" />,
              title: t("common.error"),
            }}
          />
        </LiyonCard>
      )}

      {/* Modal Create / Edit Personnel */}
      <LiyonDialog open={personnelModalOpen} onOpenChange={setPersonnelModalOpen} wide>
        <LiyonDialogCloseButton label={t("personnel.cancel")} />
        <LiyonDialogHeader
          title={editingPersonnel ? t("personnel.edit") : t("personnel.create")}
          description={editingPersonnel ? editingPersonnel.fullNameTh : t("personnel.subtitle")}
        />
        <LiyonDialogBody className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <LiyonField label={t("personnel.academicTitle")} htmlFor="academicTitle" hint="เช่น ศ., รศ.ดร., ผศ., ดร., อ.">
              <input
                id="academicTitle"
                type="text"
                value={academicTitle}
                onChange={(e) => setAcademicTitle(e.target.value)}
                placeholder="ศ.ดร. / ผศ."
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
              />
            </LiyonField>

            <LiyonField label={t("personnel.firstNameTh")} htmlFor="firstNameTh">
              <input
                id="firstNameTh"
                type="text"
                value={firstNameTh}
                onChange={(e) => setFirstNameTh(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
                required
              />
            </LiyonField>

            <LiyonField label={t("personnel.lastNameTh")} htmlFor="lastNameTh">
              <input
                id="lastNameTh"
                type="text"
                value={lastNameTh}
                onChange={(e) => setLastNameTh(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
                required
              />
            </LiyonField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LiyonField label={t("personnel.firstNameEn")} htmlFor="firstNameEn">
              <input
                id="firstNameEn"
                type="text"
                value={firstNameEn}
                onChange={(e) => setFirstNameEn(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
                required
              />
            </LiyonField>

            <LiyonField label={t("personnel.lastNameEn")} htmlFor="lastNameEn">
              <input
                id="lastNameEn"
                type="text"
                value={lastNameEn}
                onChange={(e) => setLastNameEn(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
                required
              />
            </LiyonField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <LiyonField label={t("personnel.department")} htmlFor="departmentId">
              <LiyonSelect
                id="departmentId"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
              >
                <option value="">{locale === "th" ? "— ไม่ระบุ —" : "— Unassigned —"}</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {locale === "th" ? d.nameTh : d.nameEn}
                  </option>
                ))}
              </LiyonSelect>
            </LiyonField>

            <LiyonField label={t("personnel.positionType")} htmlFor="positionType">
              <LiyonSelect
                id="positionType"
                value={positionType}
                onChange={(e) => setPositionType(e.target.value as PositionTypeValue)}
              >
                <option value="ACADEMIC">{t("personnel.positionType.academic")}</option>
                <option value="SUPPORT">{t("personnel.positionType.support")}</option>
              </LiyonSelect>
            </LiyonField>

            <LiyonField label={t("personnel.orderIndex")} htmlFor="orderIndex">
              <input
                id="orderIndex"
                type="number"
                value={orderIndex}
                onChange={(e) => setOrderIndex(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
              />
            </LiyonField>
          </div>

          {/* Executive Section */}
          <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-4">
            <div className="flex items-center gap-2">
              <input
                id="isExecutive"
                type="checkbox"
                checked={isExecutive}
                onChange={(e) => setIsExecutive(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="isExecutive" className="text-sm font-semibold text-foreground cursor-pointer">
                {t("personnel.isExecutive")}
              </label>
            </div>

            {isExecutive && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <LiyonField label={t("personnel.executivePositionTh")} htmlFor="execTh" hint="เช่น คณบดี, รองคณบดีฝ่ายวิชาการ">
                  <input
                    id="execTh"
                    type="text"
                    value={executivePositionTh}
                    onChange={(e) => setExecutivePositionTh(e.target.value)}
                    placeholder="คณบดี"
                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
                  />
                </LiyonField>

                <LiyonField label={t("personnel.executivePositionEn")} htmlFor="execEn" hint="e.g. Dean, Associate Dean">
                  <input
                    id="execEn"
                    type="text"
                    value={executivePositionEn}
                    onChange={(e) => setExecutivePositionEn(e.target.value)}
                    placeholder="Dean"
                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
                  />
                </LiyonField>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <LiyonField label={t("personnel.email")} htmlFor="email">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="faculty@university.ac.th"
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
              />
            </LiyonField>

            <LiyonField label={t("personnel.phone")} htmlFor="phone">
              <input
                id="phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="02-123-4567"
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
              />
            </LiyonField>

            <LiyonField label={t("personnel.officeRoom")} htmlFor="officeRoom">
              <input
                id="officeRoom"
                type="text"
                value={officeRoom}
                onChange={(e) => setOfficeRoom(e.target.value)}
                placeholder="อาคาร 1 ชั้น 3 ห้อง 305"
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
              />
            </LiyonField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LiyonField label={t("personnel.avatarUrl")} htmlFor="avatarUrl">
              <input
                id="avatarUrl"
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
              />
            </LiyonField>

            <LiyonField label={t("personnel.researchInterests")} htmlFor="research" hint="คั่นด้วยเครื่องหมายจุลภาค (,) เช่น AI, Cloud, IoT">
              <input
                id="research"
                type="text"
                value={researchInterests}
                onChange={(e) => setResearchInterests(e.target.value)}
                placeholder="Artificial Intelligence, Machine Learning, Data Science"
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
              />
            </LiyonField>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              id="isActive"
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-foreground cursor-pointer">
              {t("personnel.isActive")}
            </label>
          </div>
        </LiyonDialogBody>
        <LiyonDialogFooter className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setPersonnelModalOpen(false)} disabled={isPending}>
            {t("personnel.cancel")}
          </Button>
          <Button onClick={handleSavePersonnel} disabled={isPending}>
            {isPending ? t("common.loading") : t("personnel.save")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>

      {/* Delete Personnel Dialog */}
      <LiyonDialog open={!!deleteConfirmPersonnel} onOpenChange={(open) => !open && setDeleteConfirmPersonnel(null)} danger>
        <LiyonDialogCloseButton label={t("personnel.cancel")} />
        <LiyonDialogHeader
          title={t("personnel.delete")}
          description={t("personnel.deleteConfirm")}
        />
        <LiyonDialogBody>
          <p className="font-semibold text-foreground">{deleteConfirmPersonnel?.fullNameTh}</p>
        </LiyonDialogBody>
        <LiyonDialogFooter className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setDeleteConfirmPersonnel(null)} disabled={isPending}>
            {t("personnel.cancel")}
          </Button>
          <Button variant="destructive" onClick={() => deleteConfirmPersonnel && handleDeletePersonnel(deleteConfirmPersonnel)} disabled={isPending}>
            {isPending ? t("common.loading") : t("personnel.delete")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>

      {/* Modal Create / Edit Department */}
      <LiyonDialog open={deptModalOpen} onOpenChange={setDeptModalOpen}>
        <LiyonDialogCloseButton label={t("department.delete")} />
        <LiyonDialogHeader
          title={editingDept ? t("department.edit") : t("department.create")}
          description={t("personnel.tabDepts")}
        />
        <LiyonDialogBody className="space-y-4">
          <LiyonField label={t("department.code")} htmlFor="deptCode">
            <input
              id="deptCode"
              type="text"
              value={deptCode}
              onChange={(e) => setDeptCode(e.target.value)}
              placeholder="CPE / IT / DSI"
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background uppercase font-mono"
              required
            />
          </LiyonField>

          <LiyonField label={t("department.nameTh")} htmlFor="deptNameTh">
            <input
              id="deptNameTh"
              type="text"
              value={deptNameTh}
              onChange={(e) => setDeptNameTh(e.target.value)}
              placeholder="สาขาวิชาวิศวกรรมคอมพิวเตอร์"
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
              required
            />
          </LiyonField>

          <LiyonField label={t("department.nameEn")} htmlFor="deptNameEn">
            <input
              id="deptNameEn"
              type="text"
              value={deptNameEn}
              onChange={(e) => setDeptNameEn(e.target.value)}
              placeholder="Department of Computer Engineering"
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
              required
            />
          </LiyonField>

          <LiyonField label={t("personnel.orderIndex")} htmlFor="deptOrder">
            <input
              id="deptOrder"
              type="number"
              value={deptOrderIndex}
              onChange={(e) => setDeptOrderIndex(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
            />
          </LiyonField>
        </LiyonDialogBody>
        <LiyonDialogFooter className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setDeptModalOpen(false)} disabled={isPending}>
            {t("personnel.cancel")}
          </Button>
          <Button onClick={handleSaveDept} disabled={isPending}>
            {isPending ? t("common.loading") : t("personnel.save")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>

      {/* Delete Department Dialog */}
      <LiyonDialog open={!!deleteConfirmDept} onOpenChange={(open) => !open && setDeleteConfirmDept(null)} danger>
        <LiyonDialogCloseButton label={t("personnel.cancel")} />
        <LiyonDialogHeader
          title={t("department.delete")}
          description={t("personnel.deleteConfirm")}
        />
        <LiyonDialogBody>
          <p className="font-semibold text-foreground">{deleteConfirmDept?.nameTh} ({deleteConfirmDept?.code})</p>
        </LiyonDialogBody>
        <LiyonDialogFooter className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setDeleteConfirmDept(null)} disabled={isPending}>
            {t("personnel.cancel")}
          </Button>
          <Button variant="destructive" onClick={() => deleteConfirmDept && handleDeleteDept(deleteConfirmDept)} disabled={isPending}>
            {isPending ? t("common.loading") : t("department.delete")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>
    </div>
  );
}
