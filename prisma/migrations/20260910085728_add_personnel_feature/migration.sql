/*
  Warnings:

  - Made the column `title_en` on table `news_articles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `content_en` on table `news_articles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `file_size` on table `news_attachments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `mime_type` on table `news_attachments` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "news_articles_tenant_id_is_pinned_idx";

-- DropIndex
DROP INDEX "news_attachments_tenant_id_article_id_idx";

-- AlterTable
ALTER TABLE "news_articles" ALTER COLUMN "title_en" SET NOT NULL,
ALTER COLUMN "content_en" SET NOT NULL;

-- AlterTable
ALTER TABLE "news_attachments" ALTER COLUMN "file_size" SET NOT NULL,
ALTER COLUMN "mime_type" SET NOT NULL;

-- CreateTable
CREATE TABLE "academic_departments" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name_th" VARCHAR(255) NOT NULL,
    "name_en" VARCHAR(255) NOT NULL,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "academic_departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personnel_profiles" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "department_id" UUID,
    "user_id" UUID,
    "academic_title" VARCHAR(50),
    "first_name_th" VARCHAR(100) NOT NULL,
    "last_name_th" VARCHAR(100) NOT NULL,
    "first_name_en" VARCHAR(100) NOT NULL,
    "last_name_en" VARCHAR(100) NOT NULL,
    "position_type" VARCHAR(50) NOT NULL DEFAULT 'ACADEMIC',
    "executive_position_th" VARCHAR(255),
    "executive_position_en" VARCHAR(255),
    "is_executive" BOOLEAN NOT NULL DEFAULT false,
    "email" VARCHAR(255),
    "phone" VARCHAR(50),
    "office_room" VARCHAR(100),
    "avatar_url" VARCHAR(500),
    "bio_th" TEXT,
    "bio_en" TEXT,
    "research_interests" TEXT,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "personnel_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personnel_publications" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "personnel_id" UUID NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "journal" VARCHAR(255),
    "year" INTEGER,
    "external_url" VARCHAR(500),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "personnel_publications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "academic_departments_tenant_id_order_index_idx" ON "academic_departments"("tenant_id", "order_index");

-- CreateIndex
CREATE UNIQUE INDEX "academic_departments_tenant_id_code_key" ON "academic_departments"("tenant_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "personnel_profiles_user_id_key" ON "personnel_profiles"("user_id");

-- CreateIndex
CREATE INDEX "personnel_profiles_tenant_id_is_executive_order_index_idx" ON "personnel_profiles"("tenant_id", "is_executive", "order_index");

-- CreateIndex
CREATE INDEX "personnel_profiles_tenant_id_department_id_idx" ON "personnel_profiles"("tenant_id", "department_id");

-- CreateIndex
CREATE INDEX "personnel_profiles_tenant_id_is_active_idx" ON "personnel_profiles"("tenant_id", "is_active");

-- CreateIndex
CREATE INDEX "personnel_publications_personnel_id_idx" ON "personnel_publications"("personnel_id");

-- CreateIndex
CREATE INDEX "news_attachments_article_id_idx" ON "news_attachments"("article_id");

-- AddForeignKey
ALTER TABLE "news_articles" ADD CONSTRAINT "news_articles_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_departments" ADD CONSTRAINT "academic_departments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personnel_profiles" ADD CONSTRAINT "personnel_profiles_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personnel_profiles" ADD CONSTRAINT "personnel_profiles_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "academic_departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personnel_profiles" ADD CONSTRAINT "personnel_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personnel_publications" ADD CONSTRAINT "personnel_publications_personnel_id_fkey" FOREIGN KEY ("personnel_id") REFERENCES "personnel_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
