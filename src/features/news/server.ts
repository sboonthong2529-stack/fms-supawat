import "server-only";

export {
  listPublishedNewsArticles,
  getFeaturedNewsArticles,
  getNewsArticleBySlug,
  listAdminNewsArticles,
  type NewsArticleDto,
} from "./_internal/services";
export { NEWS_P, NEWS_PERMISSIONS } from "./permissions";
