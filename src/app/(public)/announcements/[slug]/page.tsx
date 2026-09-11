import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/shared/lib/infra/prisma";
import { getT } from "@/i18n/server";
import { getLocale } from "@/shared/lib/i18n/server";
import { formatDate } from "@/shared/lib/format";
import { getNewsArticleBySlug } from "@/features/news/server";
import { Calendar, Eye, ArrowLeft, Newspaper } from "lucide-react";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const tenant = await prisma.tenant.findFirst({ where: { isActive: true } });
  if (!tenant) return { title: "News" };

  const article = await getNewsArticleBySlug(tenant.id, slug);
  if (!article) return { title: "Not Found" };

  const title = locale === "th" ? article.titleTh : article.titleEn;
  const description = locale === "th" ? article.summaryTh : article.summaryEn;

  return {
    title: `${title} | Faculty of Technology & Innovation`,
    description: description || undefined,
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const t = await getT();
  const locale = await getLocale();

  const tenant = await prisma.tenant.findFirst({ where: { isActive: true } });
  if (!tenant) notFound();

  const article = await getNewsArticleBySlug(tenant.id, slug);
  if (!article || article.status !== "PUBLISHED") {
    notFound();
  }

  const mainTitle = locale === "th" ? article.titleTh : article.titleEn;
  const secondaryTitle = locale === "th" ? article.titleEn : article.titleTh;
  const mainContent = locale === "th" ? article.contentTh : article.contentEn;
  const summary = locale === "th" ? article.summaryTh : article.summaryEn || article.summaryTh;

  return (
    <article className="container mx-auto px-4 sm:px-6 py-12 max-w-4xl space-y-8">
      {/* Back Button */}
      <div>
        <Link
          href="/announcements"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t("news.portal.backToNews")}</span>
        </Link>
      </div>

      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="rounded-md bg-primary/10 px-2.5 py-1 font-semibold text-primary">
            {article.category}
          </span>
          {article.publishedAt && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(new Date(article.publishedAt), locale)}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5" />
            {article.viewCount} {t("news.viewCount")}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
          {mainTitle}
        </h1>

        {secondaryTitle && (
          <p className="text-lg text-muted-foreground font-medium">
            {secondaryTitle}
          </p>
        )}
      </div>

      {/* Cover Image */}
      {article.coverImageUrl ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-border shadow-sm">
          <Image
            src={article.coverImageUrl}
            alt={mainTitle}
            fill
            sizes="(max-width: 768px) 100vw, 896px"
            className="object-cover"
            priority
            unoptimized
          />
        </div>
      ) : (
        <div className="h-32 w-full rounded-3xl bg-gradient-to-r from-primary/10 to-primary/5 border border-border flex items-center justify-center text-primary/30">
          <Newspaper className="h-12 w-12" />
        </div>
      )}

      {/* Summary Box */}
      {summary && (
        <div className="rounded-2xl border-l-4 border-primary bg-muted/40 p-6 text-foreground/90 italic text-base leading-relaxed">
          {summary}
        </div>
      )}

      {/* Content */}
      <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground/90 leading-relaxed space-y-4 text-base whitespace-pre-line">
        {mainContent}
      </div>

      {/* Footer / Share */}
      <div className="border-t border-border pt-8 mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          href="/announcements"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t("news.portal.backToNews")}</span>
        </Link>
      </div>
    </article>
  );
}
