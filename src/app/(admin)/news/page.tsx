import { requirePermission, hasPermission } from "@/features/identity/server";
import { NEWS_P, listAdminNewsArticles } from "@/features/news/server";
import { NewsClient } from "./_components/news-client";

export default async function NewsPage() {
  const ctx = await requirePermission(NEWS_P.newsRead);
  const initialNews = await listAdminNewsArticles(ctx.tenantId);

  return (
    <NewsClient
      initialNews={initialNews}
      canManage={hasPermission(ctx, NEWS_P.newsManage)}
    />
  );
}
