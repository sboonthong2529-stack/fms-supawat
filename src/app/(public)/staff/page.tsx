import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/shared/lib/infra/prisma";
import { getT } from "@/i18n/server";
import { getLocale } from "@/shared/lib/i18n/server";
import {
  listPublicExecutives,
  listPublicPersonnel,
  listDepartments,
} from "@/features/personnel/server";
import { Search, Mail, Phone, MapPin, Award, BookOpen, Users } from "lucide-react";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: `${t("personnel.portal.title")} | Faculty of Technology & Innovation`,
    description: t("personnel.portal.subtitle"),
  };
}

interface Props {
  searchParams: Promise<{
    dept?: string;
    q?: string;
    tab?: string;
  }>;
}

export default async function StaffDirectoryPage({ searchParams }: Props) {
  const t = await getT();
  const locale = await getLocale();
  const params = await searchParams;
  const currentDept = params.dept || "ALL";
  const searchQuery = params.q || "";
  const activeTab = params.tab || "executives";

  const tenant = await prisma.tenant.findFirst({ where: { isActive: true } });
  const tenantId = tenant?.id ?? "";

  const [executives, personnel, departments] = await Promise.all([
    tenantId ? listPublicExecutives(tenantId) : Promise.resolve([]),
    tenantId
      ? listPublicPersonnel(tenantId, { departmentId: currentDept, search: searchQuery })
      : Promise.resolve([]),
    tenantId ? listDepartments(tenantId) : Promise.resolve([]),
  ]);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          {t("personnel.portal.title")}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          {t("personnel.portal.subtitle")}
        </p>

        {/* Search Bar */}
        <form method="GET" action="/staff" className="relative max-w-xl mx-auto pt-2">
          <input type="hidden" name="tab" value={activeTab} />
          {currentDept !== "ALL" && <input type="hidden" name="dept" value={currentDept} />}
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            name="q"
            defaultValue={searchQuery}
            placeholder={t("personnel.portal.searchPlaceholder")}
            className="w-full pl-10 pr-24 py-2.5 text-sm bg-card border border-border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-lg bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {locale === "th" ? "ค้นหา" : "Search"}
          </button>
        </form>
      </div>

      {/* Main Tabs: Executives vs Faculty/Staff */}
      <div className="flex items-center justify-center gap-4 border-b border-border pb-4">
        <Link
          href={`/staff?tab=executives${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`}
          className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
            activeTab === "executives"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          <Award className="h-4 w-4" />
          <span>{t("personnel.tabExecutives")}</span>
        </Link>
        <Link
          href={`/staff?tab=departments${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`}
          className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
            activeTab === "departments"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          <Users className="h-4 w-4" />
          <span>{t("personnel.tabStaff")}</span>
        </Link>
      </div>

      {/* Tab 1: Executive Board */}
      {activeTab === "executives" && (
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">{t("personnel.tabExecutives")}</h2>
            <p className="text-xs text-muted-foreground mt-1">
              {locale === "th"
                ? "คณะผู้บริหาร คณะเทคโนโลยีและนวัตกรรม"
                : "Executive Board of the Faculty"}
            </p>
          </div>

          {executives.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border p-12 text-center text-muted-foreground">
              <Users className="mx-auto h-12 w-12 opacity-30 mb-2" />
              <p>{t("personnel.empty")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {executives.map((exec) => (
                <div
                  key={exec.id}
                  className="flex flex-col items-center text-center rounded-3xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-300 space-y-4"
                >
                  <div className="relative h-32 w-32 rounded-full overflow-hidden border-2 border-primary/20 bg-muted shadow-inner">
                    {exec.avatarUrl ? (
                      <Image
                        src={exec.avatarUrl}
                        alt={exec.fullNameTh}
                        fill
                        sizes="128px"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-bold text-2xl">
                        {exec.firstNameTh.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                      {locale === "th"
                        ? exec.executivePositionTh || "กรรมการบริหาร"
                        : exec.executivePositionEn || "Executive Board Member"}
                    </span>
                    <h3 className="font-bold text-lg text-foreground pt-1">
                      {locale === "th" ? exec.fullNameTh : exec.fullNameEn}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {locale === "th" ? exec.departmentNameTh : exec.departmentNameEn}
                    </p>
                  </div>

                  <div className="pt-2 w-full border-t border-border/60 text-xs text-muted-foreground space-y-1.5">
                    {exec.email && (
                      <div className="flex items-center justify-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-primary" />
                        <a href={`mailto:${exec.email}`} className="hover:underline">
                          {exec.email}
                        </a>
                      </div>
                    )}
                    {exec.officeRoom && (
                      <div className="flex items-center justify-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        <span>{exec.officeRoom}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Tab 2: Departments & Faculty */}
      {activeTab === "departments" && (
        <section className="space-y-8">
          {/* Department Filter Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link
              href={`/staff?tab=departments&dept=ALL${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                currentDept === "ALL"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {t("personnel.portal.allDepartments")}
            </Link>
            {departments.map((d) => (
              <Link
                key={d.id}
                href={`/staff?tab=departments&dept=${d.id}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                  currentDept === d.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {locale === "th" ? d.nameTh : d.nameEn}
              </Link>
            ))}
          </div>

          {personnel.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border p-12 text-center text-muted-foreground">
              <Users className="mx-auto h-12 w-12 opacity-30 mb-2" />
              <p>{t("personnel.empty")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {personnel.map((person) => (
                <div
                  key={person.id}
                  className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0 rounded-2xl overflow-hidden border border-border bg-muted">
                      {person.avatarUrl ? (
                        <Image
                          src={person.avatarUrl}
                          alt={person.fullNameTh}
                          fill
                          sizes="80px"
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-bold text-xl">
                          {person.firstNameTh.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="space-y-1 flex-1">
                      <span className="inline-block rounded bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                        {person.positionType === "ACADEMIC"
                          ? t("personnel.positionType.academic")
                          : t("personnel.positionType.support")}
                      </span>
                      <h3 className="font-bold text-base text-foreground leading-snug">
                        {locale === "th" ? person.fullNameTh : person.fullNameEn}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {locale === "th" ? person.departmentNameTh : person.departmentNameEn}
                      </p>
                    </div>
                  </div>

                  {/* Research Interests Tags */}
                  {person.researchInterests && (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
                        <BookOpen className="h-3 w-3" />
                        <span>{t("personnel.researchInterests")}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {person.researchInterests.split(",").map((tag, idx) => (
                          <span
                            key={idx}
                            className="rounded-md bg-primary/5 px-2 py-0.5 text-[11px] font-medium text-primary border border-primary/10"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="mt-auto pt-3 border-t border-border/60 text-xs text-muted-foreground space-y-1">
                    {person.email && (
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-primary" />
                        <a href={`mailto:${person.email}`} className="hover:underline">
                          {person.email}
                        </a>
                      </div>
                    )}
                    {person.phone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-primary" />
                        <span>{person.phone}</span>
                      </div>
                    )}
                    {person.officeRoom && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        <span>{person.officeRoom}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
