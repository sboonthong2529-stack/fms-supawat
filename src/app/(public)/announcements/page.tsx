import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/shared/lib/infra/prisma";
import { getT } from "@/i18n/server";
import { getLocale } from "@/shared/lib/i18n/server";
import { formatDate } from "@/shared/lib/format";
import { listPublishedNewsArticles } from "@/features/news/server";
import { Search, Calendar, Eye, Newspaper, ArrowRight } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: `${t("news.portal.title")} | Faculty of Technology & Innovation`,
    description: t("news.portal.subtitle"),
  };
}

interface Props {
  searchParams: Promise<{
    category?: string;
    q?: string;
  }>;
}

export default async function AnnouncementsPage({ searchParams }: Props) {
  const t = await getT();
  const locale = await getLocale();
  const params = await searchParams;
  const currentCategory = params.category || "ALL";
  const searchQuery = params.q || "";

  const tenant = await prisma.tenant.findFirst({ where: { isActive: true } });
  const tenantId = tenant?.id ?? "";

  const newsResult = tenantId
    ? await listPublishedNewsArticles(tenantId, {
        category: currentCategory,
        search: searchQuery,
        limit: 30,
      })
    : { items: [], total: 0 };

  const articles = newsResult.items;

  const categories = [
    { key: "ALL", label: t("news.category.all") },
    { key: "GENERAL", label: t("news.category.general") },
    { key: "ACADEMIC", label: t("news.category.academic") },
    { key: "ACTIVITY", label: t("news.category.activity") },
    { key: "PROCUREMENT", label: t("news.category.procurement") },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          {t("news.portal.title")}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          {t("news.portal.subtitle")}
        </p>

        {/* Search Bar */}
        <form method="GET" action="/announcements" className="relative max-w-xl mx-auto pt-2">
          {currentCategory !== "ALL" && (
            <input type="hidden" name="category" value={currentCategory} />
          )}
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            name="q"
            defaultValue={searchQuery}
            placeholder={t("news.portal.searchPlaceholder")}
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

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-border pb-4">
        {categories.map((cat) => {
          const isActive = currentCategory === cat.key;
          const href = `/announcements?category=${cat.key}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`;

          return (
            <Link
              key={cat.key}
              href={href}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {cat.label}
            </Link>
          );
        })}
      </div>

      {/* Articles Grid */}
      {articles.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border p-16 text-center text-muted-foreground space-y-3">
          <Newspaper className="mx-auto h-12 w-12 opacity-30" />
          <p className="text-base font-semibold text-foreground">{t("news.empty")}</p>
          <p className="text-xs">{t("news.subtitle")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((item) => (
            <Link
              key={item.id}
              href={`/announcements/${item.slug}`}
              className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
            >
              {item.coverImageUrl ? (
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  <Image
                    src={item.coverImageUrl}
                    alt={item.titleTh}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="aspect-video w-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary/40">
                  <Newspaper className="h-10 w-10" />
                </div>
              )}

              <div className="flex flex-1 flex-col p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="rounded bg-muted px-2 py-0.5 font-medium text-foreground">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-2">
                    {item.publishedAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(new Date(item.publishedAt), locale)}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {item.viewCount}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-base text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {locale === "th" ? item.titleTh : item.titleEn}
                </h3>

                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed flex-1">
                  {locale === "th"
                    ? item.summaryTh || item.contentTh.slice(0, 150)
                    : item.summaryEn || item.contentEn.slice(0, 150)}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs font-semibold text-primary">
                  <span>{t("news.portal.readMore")}</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
