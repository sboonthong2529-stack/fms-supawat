-- CreateTable
CREATE TABLE "curriculum_programs" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "department_id" UUID,
    "code" VARCHAR(50) NOT NULL,
    "degree_level" VARCHAR(50) NOT NULL DEFAULT 'BACHELOR',
    "name_th" VARCHAR(255) NOT NULL,
    "name_en" VARCHAR(255) NOT NULL,
    "degree_name_th" VARCHAR(255) NOT NULL,
    "degree_name_en" VARCHAR(255) NOT NULL,
    "total_credits" INTEGER NOT NULL DEFAULT 0,
    "duration_years" INTEGER NOT NULL DEFAULT 4,
    "tuition_fee_per_term" INTEGER,
    "description_th" TEXT NOT NULL,
    "description_en" TEXT NOT NULL,
    "career_paths_th" TEXT,
    "career_paths_en" TEXT,
    "curriculum_file_url" VARCHAR(500),
    "cover_image_url" VARCHAR(500),
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "curriculum_programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "curriculum_courses" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "program_id" UUID NOT NULL,
    "course_code" VARCHAR(20) NOT NULL,
    "name_th" VARCHAR(255) NOT NULL,
    "name_en" VARCHAR(255) NOT NULL,
    "credits" INTEGER NOT NULL DEFAULT 3,
    "lecture_hours" INTEGER,
    "lab_hours" INTEGER,
    "self_study_hours" INTEGER,
    "course_category" VARCHAR(50) NOT NULL DEFAULT 'CORE',
    "year" INTEGER NOT NULL DEFAULT 1,
    "semester" INTEGER NOT NULL DEFAULT 1,
    "description_th" TEXT,
    "description_en" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "curriculum_courses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "curriculum_programs_tenant_id_degree_level_order_index_idx" ON "curriculum_programs"("tenant_id", "degree_level", "order_index");

-- CreateIndex
CREATE INDEX "curriculum_programs_tenant_id_department_id_idx" ON "curriculum_programs"("tenant_id", "department_id");

-- CreateIndex
CREATE INDEX "curriculum_programs_tenant_id_is_active_idx" ON "curriculum_programs"("tenant_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "curriculum_programs_tenant_id_code_key" ON "curriculum_programs"("tenant_id", "code");

-- CreateIndex
CREATE INDEX "curriculum_courses_program_id_year_semester_idx" ON "curriculum_courses"("program_id", "year", "semester");

-- AddForeignKey
ALTER TABLE "curriculum_programs" ADD CONSTRAINT "curriculum_programs_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curriculum_programs" ADD CONSTRAINT "curriculum_programs_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "academic_departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curriculum_courses" ADD CONSTRAINT "curriculum_courses_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "curriculum_programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
