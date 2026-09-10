"use client";

import { useState, useTransition } from "react";
import { Plus, Edit2, Trash2, GraduationCap, Search, ExternalLink } from "lucide-react";
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
  type StatusPillTone,
} from "@/shared/components/liyon";
import { Button } from "@/components/ui/button";
import type {
  CurriculumProgramDto,
  DegreeLevel,
} from "@/features/curriculum";
import type { AcademicDepartmentDto } from "@/features/personnel";
import {
  createProgramAction,
  updateProgramAction,
  deleteProgramAction,
} from "@/features/curriculum/actions";

interface Props {
  initialPrograms: CurriculumProgramDto[];
  departments: AcademicDepartmentDto[];
  canManage: boolean;
}

export function CurriculumClient({
  initialPrograms,
  departments,
  canManage,
}: Props) {
  const t = useT();
  const locale = useLocale();

  const [programs, setPrograms] = useState<CurriculumProgramDto[]>(initialPrograms);
  const [isPending, startTransition] = useTransition();

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
  const [selectedDept, setSelectedDept] = useState<string>("ALL");

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<CurriculumProgramDto | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<CurriculumProgramDto | null>(null);

  // Form State
  const [code, setCode] = useState("");
  const [degreeLevel, setDegreeLevel] = useState<DegreeLevel>("BACHELOR");
  const [departmentId, setDepartmentId] = useState("");
  const [nameTh, setNameTh] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [degreeNameTh, setDegreeNameTh] = useState("");
  const [degreeNameEn, setDegreeNameEn] = useState("");
  const [totalCredits, setTotalCredits] = useState(128);
  const [durationYears, setDurationYears] = useState(4);
  const [tuitionFeePerTerm, setTuitionFeePerTerm] = useState<number | undefined>(undefined);
  const [descriptionTh, setDescriptionTh] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [careerPathsTh, setCareerPathsTh] = useState("");
  const [careerPathsEn, setCareerPathsEn] = useState("");
  const [curriculumFileUrl, setCurriculumFileUrl] = useState("");
  const [orderIndex, setOrderIndex] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // Handlers
  const openCreateModal = () => {
    setEditingProgram(null);
    setCode("");
    setDegreeLevel("BACHELOR");
    setDepartmentId(departments[0]?.id || "");
    setNameTh("");
    setNameEn("");
    setDegreeNameTh("");
    setDegreeNameEn("");
    setTotalCredits(128);
    setDurationYears(4);
    setTuitionFeePerTerm(undefined);
    setDescriptionTh("");
    setDescriptionEn("");
    setCareerPathsTh("");
    setCareerPathsEn("");
    setCurriculumFileUrl("");
    setOrderIndex(programs.length + 1);
    setIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (p: CurriculumProgramDto) => {
    setEditingProgram(p);
    setCode(p.code);
    setDegreeLevel(p.degreeLevel as DegreeLevel);
    setDepartmentId(p.departmentId || "");
    setNameTh(p.nameTh);
    setNameEn(p.nameEn);
    setDegreeNameTh(p.degreeNameTh);
    setDegreeNameEn(p.degreeNameEn);
    setTotalCredits(p.totalCredits);
    setDurationYears(p.durationYears);
    setTuitionFeePerTerm(p.tuitionFeePerTerm ?? undefined);
    setDescriptionTh(p.descriptionTh);
    setDescriptionEn(p.descriptionEn);
    setCareerPathsTh(p.careerPathsTh || "");
    setCareerPathsEn(p.careerPathsEn || "");
    setCurriculumFileUrl(p.curriculumFileUrl || "");
    setOrderIndex(p.orderIndex);
    setIsActive(p.isActive);
    setModalOpen(true);
  };

  const handleSaveProgram = () => {
    if (!code.trim() || !nameTh.trim() || !nameEn.trim() || !degreeNameTh.trim() || !descriptionTh.trim()) {
      toast.error(t("curriculum.program.nameTh") + ", " + t("curriculum.program.code"));
      return;
    }

    startTransition(async () => {
      const payload = {
        code,
        degreeLevel,
        departmentId: departmentId || null,
        nameTh,
        nameEn,
        degreeNameTh,
        degreeNameEn,
        totalCredits: Number(totalCredits),
        durationYears: Number(durationYears),
        tuitionFeePerTerm: tuitionFeePerTerm ? Number(tuitionFeePerTerm) : null,
        descriptionTh,
        descriptionEn: descriptionEn || descriptionTh,
        careerPathsTh: careerPathsTh || null,
        careerPathsEn: careerPathsEn || null,
        curriculumFileUrl: curriculumFileUrl || null,
        orderIndex: Number(orderIndex),
        isActive,
      };

      if (editingProgram) {
        const res = await updateProgramAction({ id: editingProgram.id, ...payload });
        if (res.ok) {
          toast.success(t("curriculum.saved.success"));
          setPrograms((prev) => prev.map((item) => (item.id === res.data.id ? res.data : item)));
          setModalOpen(false);
        } else {
          toast.error(res.error.message);
        }
      } else {
        const res = await createProgramAction(payload);
        if (res.ok) {
          toast.success(t("curriculum.saved.success"));
          setPrograms((prev) => [res.data, ...prev]);
          setModalOpen(false);
        } else {
          toast.error(res.error.message);
        }
      }
    });
  };

  const handleDeleteProgram = (p: CurriculumProgramDto) => {
    startTransition(async () => {
      const res = await deleteProgramAction(p.id);
      if (res.ok) {
        toast.success(t("curriculum.deleted.success"));
        setPrograms((prev) => prev.filter((i) => i.id !== p.id));
        setDeleteConfirm(null);
      } else {
        toast.error(res.error.message);
      }
    });
  };

  // Filter list
  const filteredPrograms = programs.filter((p) => {
    const matchesSearch =
      !searchQuery.trim() ||
      p.nameTh.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.degreeNameTh.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel = selectedLevel === "ALL" || p.degreeLevel === selectedLevel;
    const matchesDept = selectedDept === "ALL" || p.departmentId === selectedDept;

    return matchesSearch && matchesLevel && matchesDept;
  });

  const columns: DataTableColumn<CurriculumProgramDto>[] = [
    {
      key: "code",
      header: t("curriculum.program.code"),
      render: (row: CurriculumProgramDto) => (
        <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
          {row.code}
        </span>
      ),
    },
    {
      key: "name",
      header: t("curriculum.program.nameTh"),
      render: (row: CurriculumProgramDto) => (
        <div className="space-y-0.5 max-w-sm">
          <div className="font-semibold text-xs text-foreground">
            {locale === "th" ? row.nameTh : row.nameEn}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {locale === "th" ? row.degreeNameTh : row.degreeNameEn}
          </div>
        </div>
      ),
    },
    {
      key: "level",
      header: t("curriculum.program.degreeLevel"),
      render: (row: CurriculumProgramDto) => {
        const tone: StatusPillTone =
          row.degreeLevel === "BACHELOR"
            ? "info"
            : row.degreeLevel === "MASTER"
            ? "ok"
            : "warn";
        const label =
          row.degreeLevel === "BACHELOR"
            ? locale === "th" ? "ปริญญาตรี" : "Bachelor's"
            : row.degreeLevel === "MASTER"
            ? locale === "th" ? "ปริญญาโท" : "Master's"
            : locale === "th" ? "ปริญญาเอก" : "Doctoral";

        return <StatusPill tone={tone}>{label}</StatusPill>;
      },
    },
    {
      key: "department",
      header: t("curriculum.program.department"),
      render: (row: CurriculumProgramDto) => (
        <span className="text-xs text-muted-foreground">
          {(locale === "th" ? row.departmentNameTh : row.departmentNameEn) || "-"}
        </span>
      ),
    },
    {
      key: "credits",
      header: t("curriculum.program.totalCredits"),
      render: (row: CurriculumProgramDto) => (
        <div className="text-xs">
          <span className="font-semibold text-foreground">{row.totalCredits}</span>
          <span className="text-muted-foreground text-[11px] ml-1">
            ({row.durationYears} {locale === "th" ? "ปี" : "y"})
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: t("curriculum.program.status"),
      render: (row: CurriculumProgramDto) => (
        <StatusPill tone={row.isActive ? "ok" : "off"}>
          {row.isActive ? t("curriculum.program.active") : t("curriculum.program.inactive")}
        </StatusPill>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span>{t("curriculum.title")}</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {t("curriculum.subtitle")}
          </p>
        </div>

        {canManage && (
          <Button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-primary text-primary-foreground text-xs font-medium px-4 py-2 rounded-xl shadow-sm hover:bg-primary/90 transition-all self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>{t("curriculum.action.create")}</span>
          </Button>
        )}
      </div>

      <LiyonCard>
        {/* Filter Toolbar */}
        <div className="p-4 border-b border-border/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            {/* Search */}
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("curriculum.search.placeholder")}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-card border border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Level Filter */}
            <div className="w-36">
              <LiyonSelect
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="text-xs py-1.5"
              >
                <option value="ALL">{t("curriculum.level.all")}</option>
                <option value="BACHELOR">{t("curriculum.level.bachelor")}</option>
                <option value="MASTER">{t("curriculum.level.master")}</option>
                <option value="DOCTORAL">{t("curriculum.level.doctoral")}</option>
              </LiyonSelect>
            </div>

            {/* Department Filter */}
            <div className="w-48">
              <LiyonSelect
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="text-xs py-1.5"
              >
                <option value="ALL">{t("curriculum.filter.allDepartments")}</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {locale === "th" ? d.nameTh : d.nameEn}
                  </option>
                ))}
              </LiyonSelect>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            {filteredPrograms.length} {locale === "th" ? "หลักสูตร" : "programs"}
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          state={filteredPrograms.length ? "data" : "empty"}
          headHeading={<h3 className="text-base font-semibold">{t("curriculum.tabs.programs")}</h3>}
          columns={columns}
          rows={filteredPrograms}
          getRowId={(r: CurriculumProgramDto) => r.id}
          renderRowMenu={
            canManage
              ? (r: CurriculumProgramDto) => (
                  <>
                    <RowMenuItem onSelect={() => openEditModal(r)}>
                      <Edit2 className="h-3.5 w-3.5 mr-2" />
                      <span>{t("curriculum.action.edit")}</span>
                    </RowMenuItem>
                    <RowMenuItem onSelect={() => window.open(`/programs/${r.id}`, "_blank")}>
                      <ExternalLink className="h-3.5 w-3.5 mr-2" />
                      <span>{t("curriculum.action.viewDetail")}</span>
                    </RowMenuItem>
                    <RowMenuItem danger onSelect={() => setDeleteConfirm(r)}>
                      <Trash2 className="h-3.5 w-3.5 mr-2 text-destructive" />
                      <span className="text-destructive">{t("curriculum.action.delete")}</span>
                    </RowMenuItem>
                  </>
                )
              : undefined
          }
          empty={{
            icon: <GraduationCap className="h-8 w-8 text-muted-foreground" />,
            title: t("curriculum.empty"),
            description: t("curriculum.subtitle"),
          }}
          error={{
            icon: <GraduationCap className="h-8 w-8 text-destructive" />,
            title: t("common.error"),
          }}
        />
      </LiyonCard>

      {/* Program Create/Edit Dialog */}
      <LiyonDialog open={modalOpen} onOpenChange={setModalOpen} wide>
        <LiyonDialogCloseButton label={locale === "th" ? "ปิด" : "Close"} />
        <LiyonDialogHeader
          title={editingProgram ? t("curriculum.action.edit") : t("curriculum.action.create")}
          description={editingProgram ? editingProgram.nameTh : t("curriculum.subtitle")}
        />

        <LiyonDialogBody className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <LiyonField label={t("curriculum.program.code")} htmlFor="progCode">
              <input
                id="progCode"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="เช่น B.Eng.-CPE"
                className="w-full px-3 py-1.5 text-xs bg-card border border-border rounded-lg"
                required
              />
            </LiyonField>

            <LiyonField label={t("curriculum.program.degreeLevel")} htmlFor="progLevel">
              <LiyonSelect
                id="progLevel"
                value={degreeLevel}
                onChange={(e) => setDegreeLevel(e.target.value as DegreeLevel)}
                className="text-xs"
              >
                <option value="BACHELOR">{t("curriculum.level.bachelor")}</option>
                <option value="MASTER">{t("curriculum.level.master")}</option>
                <option value="DOCTORAL">{t("curriculum.level.doctoral")}</option>
              </LiyonSelect>
            </LiyonField>

            <LiyonField label={t("curriculum.program.department")} htmlFor="progDept">
              <LiyonSelect
                id="progDept"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="text-xs"
              >
                <option value="">{locale === "th" ? "-- ไม่ระบุสาขา --" : "-- None --"}</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {locale === "th" ? d.nameTh : d.nameEn}
                  </option>
                ))}
              </LiyonSelect>
            </LiyonField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LiyonField label={t("curriculum.program.nameTh")} htmlFor="progNameTh">
              <input
                id="progNameTh"
                type="text"
                value={nameTh}
                onChange={(e) => setNameTh(e.target.value)}
                placeholder="เช่น วิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมคอมพิวเตอร์"
                className="w-full px-3 py-1.5 text-xs bg-card border border-border rounded-lg"
                required
              />
            </LiyonField>

            <LiyonField label={t("curriculum.program.nameEn")} htmlFor="progNameEn">
              <input
                id="progNameEn"
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Bachelor of Engineering in Computer Engineering"
                className="w-full px-3 py-1.5 text-xs bg-card border border-border rounded-lg"
                required
              />
            </LiyonField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LiyonField label={t("curriculum.program.degreeNameTh")} htmlFor="progDegTh">
              <input
                id="progDegTh"
                type="text"
                value={degreeNameTh}
                onChange={(e) => setDegreeNameTh(e.target.value)}
                placeholder="เช่น วศ.บ. (วิศวกรรมคอมพิวเตอร์)"
                className="w-full px-3 py-1.5 text-xs bg-card border border-border rounded-lg"
                required
              />
            </LiyonField>

            <LiyonField label={t("curriculum.program.degreeNameEn")} htmlFor="progDegEn">
              <input
                id="progDegEn"
                type="text"
                value={degreeNameEn}
                onChange={(e) => setDegreeNameEn(e.target.value)}
                placeholder="e.g. B.Eng. (Computer Engineering)"
                className="w-full px-3 py-1.5 text-xs bg-card border border-border rounded-lg"
                required
              />
            </LiyonField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <LiyonField label={t("curriculum.program.totalCredits")} htmlFor="progCredits">
              <input
                id="progCredits"
                type="number"
                value={totalCredits}
                onChange={(e) => setTotalCredits(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs bg-card border border-border rounded-lg"
                required
              />
            </LiyonField>

            <LiyonField label={t("curriculum.program.durationYears")} htmlFor="progDuration">
              <input
                id="progDuration"
                type="number"
                value={durationYears}
                onChange={(e) => setDurationYears(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs bg-card border border-border rounded-lg"
                required
              />
            </LiyonField>

            <LiyonField label={t("curriculum.program.tuitionFee")} htmlFor="progFee">
              <input
                id="progFee"
                type="number"
                value={tuitionFeePerTerm ?? ""}
                onChange={(e) => setTuitionFeePerTerm(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="เช่น 25000"
                className="w-full px-3 py-1.5 text-xs bg-card border border-border rounded-lg"
              />
            </LiyonField>
          </div>

          <LiyonField label={t("curriculum.program.descriptionTh")} htmlFor="progDescTh">
            <textarea
              id="progDescTh"
              rows={3}
              value={descriptionTh}
              onChange={(e) => setDescriptionTh(e.target.value)}
              placeholder="รายละเอียด ปรัชญา และวัตถุประสงค์ของหลักสูตร"
              className="w-full px-3 py-1.5 text-xs bg-card border border-border rounded-lg"
              required
            />
          </LiyonField>

          <LiyonField label={t("curriculum.program.descriptionEn")} htmlFor="progDescEn">
            <textarea
              id="progDescEn"
              rows={3}
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              placeholder="Program philosophy and objectives in English"
              className="w-full px-3 py-1.5 text-xs bg-card border border-border rounded-lg"
              required
            />
          </LiyonField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LiyonField label={t("curriculum.program.careerPathsTh")} htmlFor="progCareerTh">
              <textarea
                id="progCareerTh"
                rows={2}
                value={careerPathsTh}
                onChange={(e) => setCareerPathsTh(e.target.value)}
                placeholder="เช่น วิศวกรซอฟต์แวร์, นักพัฒนาปัญญาประดิษฐ์, สถาปนิกคลาวด์"
                className="w-full px-3 py-1.5 text-xs bg-card border border-border rounded-lg"
              />
            </LiyonField>

            <LiyonField label={t("curriculum.program.careerPathsEn")} htmlFor="progCareerEn">
              <textarea
                id="progCareerEn"
                rows={2}
                value={careerPathsEn}
                onChange={(e) => setCareerPathsEn(e.target.value)}
                placeholder="e.g. Software Engineer, AI Developer, Cloud Architect"
                className="w-full px-3 py-1.5 text-xs bg-card border border-border rounded-lg"
              />
            </LiyonField>
          </div>

          <LiyonField label={t("curriculum.program.curriculumFileUrl")} htmlFor="progFile">
            <input
              id="progFile"
              type="text"
              value={curriculumFileUrl}
              onChange={(e) => setCurriculumFileUrl(e.target.value)}
              placeholder="https://.../curriculum-file.pdf"
              className="w-full px-3 py-1.5 text-xs bg-card border border-border rounded-lg"
            />
          </LiyonField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <LiyonField label={t("curriculum.program.orderIndex")} htmlFor="progOrder">
              <input
                id="progOrder"
                type="number"
                value={orderIndex}
                onChange={(e) => setOrderIndex(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs bg-card border border-border rounded-lg"
              />
            </LiyonField>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="programActiveCheckbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="programActiveCheckbox" className="text-xs font-medium text-foreground cursor-pointer">
                {t("curriculum.program.active")}
              </label>
            </div>
          </div>
        </LiyonDialogBody>

        <LiyonDialogFooter>
          <Button
            variant="outline"
            onClick={() => setModalOpen(false)}
            disabled={isPending}
            className="text-xs"
          >
            {locale === "th" ? "ยกเลิก" : "Cancel"}
          </Button>
          <Button
            onClick={handleSaveProgram}
            disabled={isPending}
            className="bg-primary text-primary-foreground text-xs"
          >
            {locale === "th" ? "บันทึก" : "Save"}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>

      {/* Delete Confirmation Dialog */}
      <LiyonDialog
        open={!!deleteConfirm}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
        danger
      >
        <LiyonDialogCloseButton label={locale === "th" ? "ปิด" : "Close"} />
        <LiyonDialogHeader
          title={t("curriculum.delete.confirm")}
          description={t("curriculum.delete.desc")}
        />
        <LiyonDialogBody>
          {deleteConfirm && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-xs font-medium text-foreground">
              {locale === "th" ? deleteConfirm.nameTh : deleteConfirm.nameEn} ({deleteConfirm.code})
            </div>
          )}
        </LiyonDialogBody>
        <LiyonDialogFooter>
          <Button
            variant="outline"
            onClick={() => setDeleteConfirm(null)}
            disabled={isPending}
            className="text-xs"
          >
            {locale === "th" ? "ยกเลิก" : "Cancel"}
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteConfirm && handleDeleteProgram(deleteConfirm)}
            disabled={isPending}
            className="text-xs"
          >
            {t("curriculum.action.delete")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>
    </div>
  );
}
