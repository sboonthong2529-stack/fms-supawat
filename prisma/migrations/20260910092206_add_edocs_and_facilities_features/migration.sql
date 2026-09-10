-- CreateTable
CREATE TABLE "edoc_templates" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name_th" VARCHAR(255) NOT NULL,
    "name_en" VARCHAR(255) NOT NULL,
    "category" VARCHAR(50) NOT NULL DEFAULT 'GENERAL',
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "edoc_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "edoc_requests" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "template_id" UUID,
    "tracking_code" VARCHAR(50) NOT NULL,
    "requester_name" VARCHAR(255) NOT NULL,
    "requester_email" VARCHAR(255) NOT NULL,
    "requester_phone" VARCHAR(50),
    "requester_type" VARCHAR(50) NOT NULL DEFAULT 'STUDENT',
    "student_or_staff_id" VARCHAR(50),
    "title" VARCHAR(255) NOT NULL,
    "details" TEXT NOT NULL,
    "attachment_url" VARCHAR(500),
    "status" VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED',
    "reviewer_remarks" TEXT,
    "reviewed_by_id" UUID,
    "reviewed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "edoc_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facility_items" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name_th" VARCHAR(255) NOT NULL,
    "name_en" VARCHAR(255) NOT NULL,
    "type" VARCHAR(50) NOT NULL DEFAULT 'MEETING_ROOM',
    "capacity" INTEGER NOT NULL DEFAULT 10,
    "location" VARCHAR(255) NOT NULL,
    "amenities" TEXT,
    "image_url" VARCHAR(500),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "facility_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facility_bookings" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "facility_id" UUID NOT NULL,
    "booking_number" VARCHAR(50) NOT NULL,
    "booker_name" VARCHAR(255) NOT NULL,
    "booker_email" VARCHAR(255) NOT NULL,
    "booker_phone" VARCHAR(50),
    "booker_dept" VARCHAR(100),
    "purpose" TEXT NOT NULL,
    "start_time" TIMESTAMPTZ NOT NULL,
    "end_time" TIMESTAMPTZ NOT NULL,
    "attendee_count" INTEGER NOT NULL DEFAULT 1,
    "status" VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    "rejection_reason" TEXT,
    "approved_by_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "facility_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "edoc_templates_tenant_id_category_idx" ON "edoc_templates"("tenant_id", "category");

-- CreateIndex
CREATE UNIQUE INDEX "edoc_templates_tenant_id_code_key" ON "edoc_templates"("tenant_id", "code");

-- CreateIndex
CREATE INDEX "edoc_requests_tenant_id_status_idx" ON "edoc_requests"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "edoc_requests_tenant_id_requester_email_idx" ON "edoc_requests"("tenant_id", "requester_email");

-- CreateIndex
CREATE UNIQUE INDEX "edoc_requests_tenant_id_tracking_code_key" ON "edoc_requests"("tenant_id", "tracking_code");

-- CreateIndex
CREATE INDEX "facility_items_tenant_id_type_is_active_idx" ON "facility_items"("tenant_id", "type", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "facility_items_tenant_id_code_key" ON "facility_items"("tenant_id", "code");

-- CreateIndex
CREATE INDEX "facility_bookings_tenant_id_facility_id_start_time_end_time_idx" ON "facility_bookings"("tenant_id", "facility_id", "start_time", "end_time");

-- CreateIndex
CREATE INDEX "facility_bookings_tenant_id_status_idx" ON "facility_bookings"("tenant_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "facility_bookings_tenant_id_booking_number_key" ON "facility_bookings"("tenant_id", "booking_number");

-- AddForeignKey
ALTER TABLE "edoc_templates" ADD CONSTRAINT "edoc_templates_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "edoc_requests" ADD CONSTRAINT "edoc_requests_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "edoc_requests" ADD CONSTRAINT "edoc_requests_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "edoc_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "edoc_requests" ADD CONSTRAINT "edoc_requests_reviewed_by_id_fkey" FOREIGN KEY ("reviewed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facility_items" ADD CONSTRAINT "facility_items_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facility_bookings" ADD CONSTRAINT "facility_bookings_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facility_bookings" ADD CONSTRAINT "facility_bookings_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facility_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facility_bookings" ADD CONSTRAINT "facility_bookings_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
