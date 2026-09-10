import { prisma } from "@/shared/lib/infra/prisma";
import type { NewsArticle, Prisma } from "@/generated/prisma";
import type { CreateNewsInput, UpdateNewsInput } from "./validations";

export interface NewsArticleDto {
  id: string;
  tenantId: string;
  titleTh: string;
  titleEn: string;
  slug: string;
  summaryTh: string | null;
  summaryEn: string | null;
  contentTh: string;
  contentEn: string;
  coverImageUrl: string | null;
  category: "ACADEMIC" | "ACTIVITY" | "GENERAL" | "PROCUREMENT";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isPinned: boolean;
  viewCount: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || `news-${Date.now()}`;
}

function toDto(article: NewsArticle): NewsArticleDto {
  return {
    id: article.id,
    tenantId: article.tenantId,
    titleTh: article.titleTh,
    titleEn: article.titleEn,
    slug: article.slug,
    summaryTh: article.summaryTh,
    summaryEn: article.summaryEn,
    contentTh: article.contentTh,
    contentEn: article.contentEn,
    coverImageUrl: article.coverImageUrl,
    category: article.category as NewsArticleDto["category"],
    status: article.status as NewsArticleDto["status"],
    isPinned: article.isPinned,
    viewCount: article.viewCount,
    publishedAt: article.publishedAt ? article.publishedAt.toISOString() : null,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
  };
}

export async function listPublishedNewsArticles(
  tenantId: string,
  options?: { category?: string; search?: string; limit?: number; offset?: number }
): Promise<{ items: NewsArticleDto[]; total: number }> {
  const { category, search, limit = 12, offset = 0 } = options ?? {};
  const where: Prisma.NewsArticleWhereInput = {
    tenantId,
    status: "PUBLISHED",
  };

  if (category && category !== "ALL") {
    where.category = category;
  }

  if (search && search.trim()) {
    const q = search.trim();
    where.OR = [
      { titleTh: { contains: q, mode: "insensitive" } },
      { titleEn: { contains: q, mode: "insensitive" } },
      { summaryTh: { contains: q, mode: "insensitive" } },
      { summaryEn: { contains: q, mode: "insensitive" } },
    ];
  }

  const [articles, total] = await Promise.all([
    prisma.newsArticle.findMany({
      where,
      orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
      take: limit,
      skip: offset,
    }),
    prisma.newsArticle.count({ where }),
  ]);

  return {
    items: articles.map(toDto),
    total,
  };
}

export async function getFeaturedNewsArticles(tenantId: string, limit = 5): Promise<NewsArticleDto[]> {
  const articles = await prisma.newsArticle.findMany({
    where: {
      tenantId,
      status: "PUBLISHED",
      isPinned: true,
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: limit,
  });

  return articles.map(toDto);
}

export async function getNewsArticleBySlug(tenantId: string, slug: string): Promise<NewsArticleDto | null> {
  const article = await prisma.newsArticle.findUnique({
    where: {
      tenantId_slug: { tenantId, slug },
    },
  });

  if (!article) return null;

  // เพิ่มยอดการเข้าชม
  prisma.newsArticle
    .update({
      where: { id: article.id },
      data: { viewCount: { increment: 1 } },
    })
    .catch(() => {});

  return toDto(article);
}

export async function listAdminNewsArticles(
  tenantId: string,
  filters?: { search?: string; category?: string; status?: string }
): Promise<NewsArticleDto[]> {
  const where: Prisma.NewsArticleWhereInput = { tenantId };

  if (filters?.category && filters.category !== "ALL") {
    where.category = filters.category;
  }

  if (filters?.status && filters.status !== "ALL") {
    where.status = filters.status;
  }

  if (filters?.search && filters.search.trim()) {
    const q = filters.search.trim();
    where.OR = [
      { titleTh: { contains: q, mode: "insensitive" } },
      { titleEn: { contains: q, mode: "insensitive" } },
    ];
  }

  const articles = await prisma.newsArticle.findMany({
    where,
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
  });

  return articles.map(toDto);
}

export async function createNewsArticle(
  tenantId: string,
  authorId: string | null,
  input: CreateNewsInput
): Promise<NewsArticleDto> {
  const baseSlug = input.slug?.trim() ? generateSlug(input.slug) : generateSlug(input.titleEn || input.titleTh);
  
  // ตรวจสอบ slug ซ้ำ
  let finalSlug = baseSlug;
  let counter = 1;
  while (await prisma.newsArticle.findUnique({ where: { tenantId_slug: { tenantId, slug: finalSlug } } })) {
    finalSlug = `${baseSlug}-${counter++}`;
  }

  const publishedAt = input.status === "PUBLISHED" 
    ? (input.publishedAt ? new Date(input.publishedAt) : new Date()) 
    : (input.publishedAt ? new Date(input.publishedAt) : null);

  const created = await prisma.newsArticle.create({
    data: {
      tenantId,
      authorId,
      titleTh: input.titleTh,
      titleEn: input.titleEn,
      slug: finalSlug,
      summaryTh: input.summaryTh ?? null,
      summaryEn: input.summaryEn ?? null,
      contentTh: input.contentTh,
      contentEn: input.contentEn,
      coverImageUrl: input.coverImageUrl ?? null,
      category: input.category,
      status: input.status,
      isPinned: input.isPinned ?? false,
      publishedAt,
    },
  });

  return toDto(created);
}

export async function updateNewsArticle(
  tenantId: string,
  input: UpdateNewsInput
): Promise<NewsArticleDto> {
  const existing = await prisma.newsArticle.findUniqueOrThrow({
    where: { id: input.id, tenantId },
  });

  let finalSlug = existing.slug;
  if (input.slug && input.slug !== existing.slug) {
    const baseSlug = generateSlug(input.slug);
    finalSlug = baseSlug;
    let counter = 1;
    while (true) {
      const match = await prisma.newsArticle.findUnique({ where: { tenantId_slug: { tenantId, slug: finalSlug } } });
      if (!match || match.id === input.id) break;
      finalSlug = `${baseSlug}-${counter++}`;
    }
  }

  let publishedAt = existing.publishedAt;
  if (input.status === "PUBLISHED" && !existing.publishedAt) {
    publishedAt = input.publishedAt ? new Date(input.publishedAt) : new Date();
  } else if (input.publishedAt) {
    publishedAt = new Date(input.publishedAt);
  }

  const updated = await prisma.newsArticle.update({
    where: { id: input.id, tenantId },
    data: {
      titleTh: input.titleTh,
      titleEn: input.titleEn,
      slug: finalSlug,
      summaryTh: input.summaryTh ?? null,
      summaryEn: input.summaryEn ?? null,
      contentTh: input.contentTh,
      contentEn: input.contentEn,
      coverImageUrl: input.coverImageUrl ?? null,
      category: input.category,
      status: input.status,
      isPinned: input.isPinned,
      publishedAt,
    },
  });

  return toDto(updated);
}

export async function deleteNewsArticle(tenantId: string, id: string): Promise<void> {
  await prisma.newsArticle.delete({
    where: { id, tenantId },
  });
}

export async function togglePinNewsArticle(tenantId: string, id: string): Promise<NewsArticleDto> {
  const current = await prisma.newsArticle.findUniqueOrThrow({
    where: { id, tenantId },
  });

  const updated = await prisma.newsArticle.update({
    where: { id, tenantId },
    data: { isPinned: !current.isPinned },
  });

  return toDto(updated);
}
