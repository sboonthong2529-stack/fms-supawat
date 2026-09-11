import type { Metadata } from "next";
import { prisma } from "@/shared/lib/infra/prisma";
import { getT } from "@/i18n/server";
import { getLocale } from "@/shared/lib/i18n/server";
import { getPublicProgramDetail } from "@/features/curriculum/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  GraduationCap,
  BookOpen,
  Clock,
  Coins,
  Briefcase,
  FileDown,
  Building2,
  Calendar,
} from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const locale = await getLocale();
  const tenant = await prisma.tenant.findFirst({ where: { isActive: true } });
  if (!tenant) return { title: "Program" };

  const program = await getPublicProgramDetail(tenant.id, id);
  if (!program) return { title: "Program Not Found" };

  const progName = locale === "th" ? program.nameTh : program.nameEn;
  const degreeName = locale === "th" ? program.degreeNameTh : program.degreeNameEn;

  return {
    title: `${progName} (${degreeName}) | Faculty of Technology & Innovation`,
    description: locale === "th" ? program.descriptionTh : program.descriptionEn,
  };
}

export default async function PublicProgramDetailPage({ params }: Props) {
  const { id } = await params;
  const t = await getT();
  const locale = await getLocale();

  const tenant = await prisma.tenant.findFirst({ where: { isActive: true } });
  const tenantId = tenant?.id ?? "";
  if (!tenantId) notFound();

  const program = await getPublicProgramDetail(tenantId, id);
  if (!program) notFound();

  const progName = locale === "th" ? program.nameTh : program.nameEn;
  const altName = locale === "th" ? program.nameEn : program.nameTh;
  const degreeName = locale === "th" ? program.degreeNameTh : program.degreeNameEn;
  const deptName = locale === "th" ? program.departmentNameTh : program.departmentNameEn;
  const desc = locale === "th" ? program.descriptionTh : program.descriptionEn;
  const career = locale === "th" ? program.careerPathsTh : program.careerPathsEn;

  const levelBadge =
    program.degreeLevel === "BACHELOR"
      ? { label: locale === "th" ? "ระดับปริญญาตรี" : "Undergraduate (Bachelor's)", bg: "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300" }
      : program.degreeLevel === "MASTER"
      ? { label: locale === "th" ? "ระดับปริญญาโท" : "Master's Degree", bg: "bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300" }
      : { label: locale === "th" ? "ระดับปริญญาเอก" : "Doctoral Degree", bg: "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300" };

  // Group courses by year and semester
  const courses = program.courses ?? [];
  const planGroups = new Map<string, typeof courses>();

  courses.forEach((c) => {
    const key = `Y${c.year}S${c.semester}`;
    if (!planGroups.has(key)) {
      planGroups.set(key, []);
    }
    planGroups.get(key)!.push(c);
  });

  const sortedGroupKeys = Array.from(planGroups.keys()).sort();

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 space-y-10 max-w-5xl">
      {/* Back Link */}
      <Link
        href="/programs"
        className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>{locale === "th" ? "กลับไปหน้ารวมหลักสูตร" : "Back to all programs"}</span>
      </Link>

      {/* Hero Header */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${levelBadge.bg}`}>
              {levelBadge.label}
            </span>
            <span className="text-xs font-mono text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
              {program.code}
            </span>
          </div>

          {program.curriculumFileUrl && (
            <a
              href={program.curriculumFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-xl hover:bg-primary/90 shadow-sm transition-all"
            >
              <FileDown className="h-4 w-4" />
              <span>{t("curriculum.action.downloadSyllabus")}</span>
            </a>
          )}
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
            {progName}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-medium">
            {altName}
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-primary">
            <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1 rounded-lg">
              <GraduationCap className="h-4 w-4" />
              <span>{degreeName}</span>
            </div>
            {deptName && (
              <div className="flex items-center gap-1.5 text-muted-foreground bg-muted px-3 py-1 rounded-lg">
                <Building2 className="h-3.5 w-3.5" />
                <span>{deptName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Key Indicators Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border/60">
          <div className="p-4 bg-muted/20 border border-border/50 rounded-2xl space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <BookOpen className="h-4 w-4 text-primary" />
              <span>{t("curriculum.program.totalCredits")}</span>
            </div>
            <div className="text-xl font-black text-foreground">
              {program.totalCredits} <span className="text-xs font-normal text-muted-foreground">{t("curriculum.course.credits")}</span>
            </div>
          </div>

          <div className="p-4 bg-muted/20 border border-border/50 rounded-2xl space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Clock className="h-4 w-4 text-primary" />
              <span>{t("curriculum.program.durationYears")}</span>
            </div>
            <div className="text-xl font-black text-foreground">
              {program.durationYears} <span className="text-xs font-normal text-muted-foreground">{locale === "th" ? "ปี" : "Years"}</span>
            </div>
          </div>

          <div className="p-4 bg-muted/20 border border-border/50 rounded-2xl space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Coins className="h-4 w-4 text-primary" />
              <span>{locale === "th" ? "ค่าธรรมเนียม/ภาค" : "Tuition Fee"}</span>
            </div>
            <div className="text-xl font-black text-foreground">
              {program.tuitionFeePerTerm ? `฿${program.tuitionFeePerTerm.toLocaleString()}` : "-"}
            </div>
          </div>

          <div className="p-4 bg-muted/20 border border-border/50 rounded-2xl space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{t("curriculum.course.title")}</span>
            </div>
            <div className="text-xl font-black text-foreground">
              {courses.length} <span className="text-xs font-normal text-muted-foreground">{locale === "th" ? "รายวิชา" : "courses"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Program Philosophy & Objectives */}
      <section className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <span>{locale === "th" ? "ปรัชญาและความสำคัญของหลักสูตร" : "Program Philosophy & Objectives"}</span>
        </h2>
        <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
          {desc}
        </div>
      </section>

      {/* Career Opportunities */}
      {career && (
        <section className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            <span>{locale === "th" ? "แนวทางการประกอบอาชีพ" : "Career Opportunities"}</span>
          </h2>
          <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line bg-muted/20 p-5 rounded-2xl border border-border/40">
            {career}
          </div>
        </section>
      )}

      {/* Curriculum Course Structure */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span>{t("curriculum.course.title")}</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            {locale === "th"
              ? "โครงสร้างรายวิชาและแผนการเรียนตลอดหลักสูตร"
              : "Study plan and course structure across all semesters"}
          </p>
        </div>

        {sortedGroupKeys.length > 0 ? (
          <div className="space-y-6">
            {sortedGroupKeys.map((groupKey) => {
              const groupCourses = planGroups.get(groupKey) || [];
              const first = groupCourses[0];
              const yearNum = first?.year || 1;
              const semNum = first?.semester || 1;

              return (
                <div
                  key={groupKey}
                  className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
                >
                  <div className="px-6 py-3.5 bg-muted/40 border-b border-border flex items-center justify-between">
                    <span className="font-bold text-sm text-foreground">
                      {locale === "th"
                        ? `ชั้นปีที่ ${yearNum} — ภาคการศึกษาที่ ${semNum}`
                        : `Year ${yearNum} — Semester ${semNum}`}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      {groupCourses.length} {locale === "th" ? "รายวิชา" : "courses"}
                    </span>
                  </div>

                  <div className="divide-y divide-border/60">
                    {groupCourses.map((c) => {
                      const courseName = locale === "th" ? c.nameTh : c.nameEn;
                      const catLabel =
                        c.courseCategory === "CORE"
                          ? t("curriculum.course.category.core")
                          : c.courseCategory === "GENERAL"
                          ? t("curriculum.course.category.general")
                          : c.courseCategory === "MAJOR_ELECTIVE"
                          ? t("curriculum.course.category.majorElective")
                          : t("curriculum.course.category.freeElective");

                      return (
                        <div key={c.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/10 transition-colors">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                                {c.courseCode}
                              </span>
                              <span className="font-semibold text-sm text-foreground">
                                {courseName}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                                {catLabel}
                              </span>
                            </div>
                            {c.nameEn && locale === "th" && (
                              <p className="text-xs text-muted-foreground">
                                {c.nameEn}
                              </p>
                            )}
                            {c.descriptionTh && (
                              <p className="text-xs text-muted-foreground pt-1">
                                {locale === "th" ? c.descriptionTh : c.descriptionEn}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-3 shrink-0 self-start sm:self-center text-xs">
                            <div className="text-right">
                              <span className="font-bold text-foreground">
                                {c.credits}
                              </span>{" "}
                              <span className="text-muted-foreground">
                                {t("curriculum.course.credits")}
                              </span>
                              {(c.lectureHours !== null || c.labHours !== null) && (
                                <div className="text-[11px] text-muted-foreground font-mono">
                                  ({c.lectureHours ?? 0}-{c.labHours ?? 0}-{c.selfStudyHours ?? 0})
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-card border border-border rounded-2xl text-xs text-muted-foreground">
            {locale === "th"
              ? "อยู่ระหว่างการปรับปรุงและอัปโหลดรายละเอียดรายวิชา"
              : "Course plan is currently being updated."}
          </div>
        )}
      </section>
    </div>
  );
}
