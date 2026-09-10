"use server";

import { revalidatePath } from "next/cache";
import { runAction, type ActionResult } from "@/shared/lib/result";
import { getLocale } from "@/shared/lib/i18n/server";
import { zodErrorMap } from "@/shared/lib/i18n/zod-locale";
import { requirePermission } from "@/features/identity/server";
import { NEWS_P } from "../permissions";
import { createNewsSchema, updateNewsSchema } from "./validations";
import {
  createNewsArticle,
  updateNewsArticle,
  deleteNewsArticle,
  togglePinNewsArticle,
  listAdminNewsArticles,
  type NewsArticleDto,
} from "./services";

export async function getAdminNewsAction(filters?: {
  search?: string;
  category?: string;
  status?: string;
}): Promise<ActionResult<NewsArticleDto[]>> {
  return runAction(async () => {
    const ctx = await requirePermission(NEWS_P.newsRead);
    return listAdminNewsArticles(ctx.tenantId, filters);
  });
}

export async function createNewsAction(input: unknown): Promise<ActionResult<NewsArticleDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(NEWS_P.newsManage);
    const parsed = createNewsSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const result = await createNewsArticle(ctx.tenantId, ctx.userId ?? null, parsed);
    revalidatePath("/news");
    revalidatePath("/");
    return result;
  });
}

export async function updateNewsAction(input: unknown): Promise<ActionResult<NewsArticleDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(NEWS_P.newsManage);
    const parsed = updateNewsSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const result = await updateNewsArticle(ctx.tenantId, parsed);
    revalidatePath("/news");
    revalidatePath("/");
    return result;
  });
}

export async function deleteNewsAction(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(NEWS_P.newsManage);
    await deleteNewsArticle(ctx.tenantId, id);
    revalidatePath("/news");
    revalidatePath("/");
  });
}

export async function togglePinNewsAction(id: string): Promise<ActionResult<NewsArticleDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(NEWS_P.newsManage);
    const result = await togglePinNewsArticle(ctx.tenantId, id);
    revalidatePath("/news");
    revalidatePath("/");
    return result;
  });
}
