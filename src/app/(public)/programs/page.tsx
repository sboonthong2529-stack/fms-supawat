import { prisma } from "@/shared/lib/infra/prisma";
import { getT } from "@/i18n/server";
import { getLocale } from "@/shared/lib/i18n/server";
import { listPublicPrograms } from "@/features/curriculum/server";
import { listDepartments } from "@/features/personnel/server";
import {
  GraduationCap,
  Search,
  BookOpen,
  Clock,
  Coins,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface Props {
  searchParams: Promise<{
    level?: string;
    dept?: string;
    q?: string;
  }>;
}

export default async function PublicProgramsPage({ searchParams }: Props) {
  const t = await getT();
  const locale = await getLocale();
  const params = await searchParams;
  const currentLevel = params.level || "ALL";
  const currentDept = params.dept || "ALL";
  const searchQuery = params.q || "";

  const tenant = await prisma.tenant.findFirst({ where: { isActive: true } });
  const tenantId = tenant?.id ?? "";

  const [programs, departments] = await Promise.all([
    tenantId
      ? listPublicPrograms(tenantId, {
          degreeLevel: currentLevel,
          departmentId: currentDept,
          search: searchQuery,
        })
      : Promise.resolve([]),
    tenantId ? listDepartments(tenantId) : Promise.resolve([]),
  ]);

  const levelTabs = [
    { id: "ALL", label: t("curriculum.level.all") },
    { id: "BACHELOR", label: t("curriculum.level.bachelor") },
    { id: "MASTER", label: t("curriculum.level.master") },
    { id: "DOCTORAL", label: t("curriculum.level.doctoral") },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Curriculum & Academic Degrees</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          {t("curriculum.publicTitle")}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          {t("curriculum.publicSubtitle")}
        </p>

        {/* Search Bar */}
        <form method="GET" action="/programs" className="relative max-w-xl mx-auto pt-2">
          {currentLevel !== "ALL" && <input type="hidden" name="level" value={currentLevel} />}
          {currentDept !== "ALL" && <input type="hidden" name="dept" value={currentDept} />}
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            name="q"
            defaultValue={searchQuery}
            placeholder={t("curriculum.search.placeholder")}
            className="w-full pl-10 pr-24 py-2.5 text-sm bg-card border border-border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            {locale === "th" ? "ค้นหา" : "Search"}
          </button>
        </form>
      </div>

      {/* Degree Level Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-border pb-4">
        {levelTabs.map((tab) => {
          const isActive = currentLevel === tab.id;
          const href = `/programs?level=${tab.id}${currentDept !== "ALL" ? `&dept=${currentDept}` : ""}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`;

          return (
            <Link
              key={tab.id}
              href={href}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Department Filter Chips */}
      {departments.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground mr-1">
            {t("curriculum.filter.department")}:
          </span>
          <Link
            href={`/programs?level=${currentLevel}&dept=ALL${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              currentDept === "ALL"
                ? "bg-foreground text-background border-foreground"
                : "bg-card text-muted-foreground border-border hover:border-foreground/40"
            }`}
          >
            {t("curriculum.filter.allDepartments")}
          </Link>
          {departments.map((d) => {
            const isSelected = currentDept === d.id;
            const deptName = locale === "th" ? d.nameTh : d.nameEn;
            return (
              <Link
                key={d.id}
                href={`/programs?level=${currentLevel}&dept=${d.id}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  isSelected
                    ? "bg-foreground text-background border-foreground"
                    : "bg-card text-muted-foreground border-border hover:border-foreground/40"
                }`}
              >
                {deptName}
              </Link>
            );
          })}
        </div>
      )}

      {/* Programs Grid */}
      {programs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((prog) => {
            const progName = locale === "th" ? prog.nameTh : prog.nameEn;
            const degreeName = locale === "th" ? prog.degreeNameTh : prog.degreeNameEn;
            const deptName = locale === "th" ? prog.departmentNameTh : prog.departmentNameEn;
            const desc = locale === "th" ? prog.descriptionTh : prog.descriptionEn;

            const levelBadge =
              prog.degreeLevel === "BACHELOR"
                ? { label: locale === "th" ? "ปริญญาตรี" : "Bachelor's", bg: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" }
                : prog.degreeLevel === "MASTER"
                ? { label: locale === "th" ? "ปริญญาโท" : "Master's", bg: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300" }
                : { label: locale === "th" ? "ปริญญาเอก" : "Doctoral", bg: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300" };

            return (
              <div
                key={prog.id}
                className="group relative flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:border-primary/40"
              >
                {/* Top Banner with degree level & code */}
                <div className="p-6 pb-4 border-b border-border/50 bg-muted/20">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${levelBadge.bg}`}>
                      {levelBadge.label}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {prog.code}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                    <Link href={`/programs/${prog.id}`}>
                      {progName}
                    </Link>
                  </h2>
                  <p className="text-xs font-medium text-primary mt-1">
                    {degreeName}
                  </p>
                  {deptName && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {deptName}
                    </p>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {desc}
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-border/60 text-center bg-muted/10 rounded-xl">
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-center text-muted-foreground">
                        <BookOpen className="h-3.5 w-3.5" />
                      </div>
                      <div className="text-xs font-bold text-foreground">
                        {prog.totalCredits}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {t("curriculum.course.credits")}
                      </div>
                    </div>

                    <div className="space-y-0.5 border-x border-border/60">
                      <div className="flex items-center justify-center text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                      </div>
                      <div className="text-xs font-bold text-foreground">
                        {prog.durationYears} {locale === "th" ? "ปี" : "Yrs"}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {locale === "th" ? "ระยะเวลา" : "Duration"}
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center justify-center text-muted-foreground">
                        <Coins className="h-3.5 w-3.5" />
                      </div>
                      <div className="text-xs font-bold text-foreground">
                        {prog.tuitionFeePerTerm ? `฿${prog.tuitionFeePerTerm.toLocaleString()}` : "-"}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {locale === "th" ? "ค่าเทอม/ภาค" : "Per Term"}
                      </div>
                    </div>
                  </div>

                  {/* Footer Link */}
                  <div className="pt-1">
                    <Link
                      href={`/programs/${prog.id}`}
                      className="inline-flex items-center justify-center w-full gap-1.5 px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-medium text-xs transition-all"
                    >
                      <span>{t("curriculum.action.viewDetail")}</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-card border border-border rounded-2xl space-y-3">
          <GraduationCap className="h-10 w-10 text-muted-foreground mx-auto stroke-1" />
          <h3 className="text-base font-semibold text-foreground">
            {t("curriculum.empty")}
          </h3>
          <p className="text-xs text-muted-foreground">
            {locale === "th"
              ? "ลองปรับเงื่อนไขการค้นหาหรือเลือกดูทุกระดับการศึกษา"
              : "Try clearing search filters or selecting 'All Levels'"}
          </p>
          {(currentLevel !== "ALL" || currentDept !== "ALL" || searchQuery) && (
            <div className="pt-2">
              <Link
                href="/programs"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-muted text-foreground text-xs font-medium hover:bg-muted/80 transition-colors"
              >
                {locale === "th" ? "ล้างตัวกรองทั้งหมด" : "Clear all filters"}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
