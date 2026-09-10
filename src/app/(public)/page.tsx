import Link from "next/link";
import { prisma } from "@/shared/lib/infra/prisma";
import { getT } from "@/i18n/server";
import { getLocale } from "@/shared/lib/i18n/server";
import { formatDate } from "@/shared/lib/format";
import {
  listPublishedNewsArticles,
  getFeaturedNewsArticles,
} from "@/features/news/server";
import {
  ArrowRight,
  Pin,
  Calendar,
  Eye,
  BookOpen,
  Users,
  Award,
  Sparkles,
  Newspaper,
} from "lucide-react";

export default async function PublicHomePage() {
  const t = await getT();
  const locale = await getLocale();

  // ดึง Default Tenant
  const tenant = await prisma.tenant.findFirst({ where: { isActive: true } });
  const tenantId = tenant?.id ?? "";

  const [featuredNews, latestNewsResult] = await Promise.all([
    tenantId ? getFeaturedNewsArticles(tenantId, 3) : Promise.resolve([]),
    tenantId
      ? listPublishedNewsArticles(tenantId, { limit: 6 })
      : Promise.resolve({ items: [], total: 0 }),
  ]);

  const latestNews = latestNewsResult.items;

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 via-background to-background py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 text-center space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>
              {locale === "th"
                ? "เปิดรับสมัครนักศึกษาใหม่ ประจำปีการศึกษา 2569"
                : "Now Accepting Applications for Academic Year 2026"}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            {locale === "th" ? (
              <>
                มุ่งสู่อนาคตด้วย{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                  เทคโนโลยีและนวัตกรรม
                </span>
              </>
            ) : (
              <>
                Shaping the Future with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                  Technology & Innovation
                </span>
              </>
            )}
          </h1>

          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {locale === "th"
              ? "ศูนย์รวมความเป็นเลิศทางวิชาการและการวิจัยชั้นนำ ผลิตบัณฑิตคุณภาพสูงที่ตอบสนองการเปลี่ยนแปลงของโลกดิจิทัล"
              : "Center of excellence in research and technology education, preparing world-class graduates for the digital future."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/announcements"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all"
            >
              <span>{t("news.portal.title")}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm hover:bg-accent transition-all"
            >
              <span>{locale === "th" ? "บริการสำหรับบุคลากร" : "Staff Services"}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured / Pinned News Banner */}
      {featuredNews.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Pin className="h-4 w-4" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {t("news.portal.featuredNews")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredNews.map((news) => (
              <Link
                key={news.id}
                href={`/announcements/${news.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300"
              >
                {news.coverImageUrl ? (
                  <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    <img
                      src={news.coverImageUrl}
                      alt={news.titleTh}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary/40">
                    <Newspaper className="h-12 w-12" />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded bg-primary/10 px-2 py-0.5 font-medium text-primary">
                      {news.category}
                    </span>
                    {news.publishedAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(new Date(news.publishedAt), locale)}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-base text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {locale === "th" ? news.titleTh : news.titleEn}
                  </h3>
                  {news.summaryTh && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {locale === "th" ? news.summaryTh : news.summaryEn || news.summaryTh}
                    </p>
                  )}
                  <div className="mt-auto pt-2 flex items-center justify-between text-xs font-semibold text-primary">
                    <span>{t("news.portal.readMore")}</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Latest News Grid */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {t("news.portal.latestNews")}
            </h2>
            <p className="text-sm text-muted-foreground">{t("news.portal.subtitle")}</p>
          </div>
          <Link
            href="/announcements"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            <span>{locale === "th" ? "ดูข่าวสารทั้งหมด" : "View All News"}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {latestNews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            <Newspaper className="mx-auto h-12 w-12 opacity-40 mb-3" />
            <p className="text-base font-medium">{t("news.empty")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestNews.map((news) => (
              <Link
                key={news.id}
                href={`/announcements/${news.slug}`}
                className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span className="rounded bg-muted px-2 py-0.5 font-medium">
                    {news.category}
                  </span>
                  <div className="flex items-center gap-3">
                    {news.publishedAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(new Date(news.publishedAt), locale)}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {news.viewCount}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-base text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                  {locale === "th" ? news.titleTh : news.titleEn}
                </h3>

                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed mb-4 flex-1">
                  {locale === "th"
                    ? news.summaryTh || news.contentTh.slice(0, 150)
                    : news.summaryEn || news.contentEn.slice(0, 150)}
                </p>

                <div className="flex items-center gap-1 text-xs font-semibold text-primary">
                  <span>{t("news.portal.readMore")}</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Quick Highlights / Faculty Stats */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="rounded-3xl border border-border bg-card p-8 md:p-12 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border">
          <div className="space-y-2">
            <div className="flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <BookOpen className="h-6 w-6" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-foreground">12+</div>
            <div className="text-sm font-medium text-muted-foreground">
              {locale === "th" ? "หลักสูตรระดับสากล" : "Academic Programs"}
            </div>
          </div>

          <div className="space-y-2 pt-6 md:pt-0">
            <div className="flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-foreground">80+</div>
            <div className="text-sm font-medium text-muted-foreground">
              {locale === "th" ? "คณาจารย์และบุคลากรผู้เชี่ยวชาญ" : "Faculty & Researchers"}
            </div>
          </div>

          <div className="space-y-2 pt-6 md:pt-0">
            <div className="flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Award className="h-6 w-6" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-foreground">100%</div>
            <div className="text-sm font-medium text-muted-foreground">
              {locale === "th" ? "การรับรองมาตรฐานการศึกษา" : "Accredited Excellence"}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
