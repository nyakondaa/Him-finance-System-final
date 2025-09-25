/*
  Warnings:

  - Added the required column `organization_id` to the `assets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `branches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `expenditure_heads` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `expenditures` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `revenue_heads` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."OrganizationType" AS ENUM ('CHURCH', 'SCHOOL', 'NGO', 'BUSINESS', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."ExemptionType" AS ENUM ('FULL', 'PARTIAL', 'SCHOLARSHIP', 'BURSARY', 'DISCOUNT', 'OTHER');

-- CreateTable
CREATE TABLE "public"."organizations" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organization_type" "public"."OrganizationType" NOT NULL,
    "address" TEXT,
    "phone_number" TEXT,
    "email" TEXT,
    "website" TEXT,
    "registration_number" TEXT,
    "tax_number" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "settings" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_code_key" ON "public"."organizations"("code");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_name_key" ON "public"."organizations"("name");

-- Insert default organization for existing data
INSERT INTO "public"."organizations" ("code", "name", "organization_type", "is_active", "created_at", "updated_at") 
VALUES ('DEFAULT', 'Default Organization', 'CHURCH', true, NOW(), NOW());

-- AlterTable - Add organization_id columns with default value
ALTER TABLE "public"."assets" ADD COLUMN     "organization_id" INTEGER NOT NULL DEFAULT 1;

ALTER TABLE "public"."branches" ADD COLUMN     "organization_id" INTEGER NOT NULL DEFAULT 1;

ALTER TABLE "public"."expenditure_heads" ADD COLUMN     "organization_id" INTEGER NOT NULL DEFAULT 1;

ALTER TABLE "public"."expenditures" ADD COLUMN     "organization_id" INTEGER NOT NULL DEFAULT 1;

ALTER TABLE "public"."members" ADD COLUMN     "organization_id" INTEGER NOT NULL DEFAULT 1;

ALTER TABLE "public"."projects" ADD COLUMN     "organization_id" INTEGER NOT NULL DEFAULT 1;

ALTER TABLE "public"."revenue_heads" ADD COLUMN     "organization_id" INTEGER NOT NULL DEFAULT 1;

ALTER TABLE "public"."transactions" ADD COLUMN     "organization_id" INTEGER NOT NULL DEFAULT 1;

ALTER TABLE "public"."users" ADD COLUMN     "organization_id" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "public"."students" (
    "id" SERIAL NOT NULL,
    "student_number" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3),
    "gender" "public"."Gender" DEFAULT 'OTHER',
    "phone_number" TEXT,
    "email" TEXT,
    "address" TEXT,
    "parent_name" TEXT,
    "parent_phone" TEXT,
    "parent_email" TEXT,
    "emergency_contact" TEXT,
    "emergency_phone" TEXT,
    "organization_id" INTEGER NOT NULL,
    "branch_code" TEXT NOT NULL,
    "academic_year_id" INTEGER,
    "grade" TEXT,
    "class" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "enrollment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."academic_years" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "organization_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academic_years_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."fee_categories" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "organization_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fee_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."fee_structures" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "fee_category_id" INTEGER NOT NULL,
    "academic_year_id" INTEGER NOT NULL,
    "organization_id" INTEGER NOT NULL,
    "amount" DECIMAL(120,2) NOT NULL,
    "currency_code" TEXT NOT NULL,
    "due_date" TIMESTAMP(3),
    "is_recurring" BOOLEAN NOT NULL DEFAULT false,
    "frequency" "public"."PaymentFrequency" DEFAULT 'MONTHLY',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fee_structures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."student_fee_payments" (
    "id" SERIAL NOT NULL,
    "receipt_number" TEXT NOT NULL,
    "student_id" INTEGER NOT NULL,
    "fee_structure_id" INTEGER NOT NULL,
    "amount" DECIMAL(120,2) NOT NULL,
    "currency_code" TEXT NOT NULL,
    "payment_method_id" INTEGER NOT NULL,
    "reference_number" TEXT,
    "payment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_by" INTEGER NOT NULL,
    "notes" TEXT,
    "status" "public"."PaymentStatus" NOT NULL DEFAULT 'COMPLETED',
    "is_recurring" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_fee_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."student_balances" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "fee_structure_id" INTEGER,
    "balance_type" "public"."BalanceType" NOT NULL,
    "balance" DECIMAL(120,2) NOT NULL,
    "credit_limit" DECIMAL(120,2),
    "currency_code" TEXT NOT NULL,
    "last_updated" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_balances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."student_balance_adjustments" (
    "id" SERIAL NOT NULL,
    "student_balance_id" INTEGER NOT NULL,
    "adjustment_type" "public"."AdjustmentType" NOT NULL,
    "amount" DECIMAL(120,2) NOT NULL,
    "reason" TEXT NOT NULL,
    "reference_number" TEXT,
    "processed_by" INTEGER NOT NULL,
    "processed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "student_balance_adjustments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."fee_reminders" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "fee_structure_id" INTEGER,
    "reminder_type" "public"."ReminderType" NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(120,2) NOT NULL,
    "currency_code" TEXT NOT NULL,
    "message" TEXT,
    "sent_at" TIMESTAMP(3),
    "method" "public"."NotificationMethod" NOT NULL DEFAULT 'EMAIL',
    "status" "public"."ReminderStatus" NOT NULL DEFAULT 'PENDING',
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fee_reminders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."fee_exemptions" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "fee_structure_id" INTEGER,
    "exemption_type" "public"."ExemptionType" NOT NULL,
    "amount" DECIMAL(120,2),
    "percentage" DECIMAL(5,2),
    "reason" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "approved_by" INTEGER NOT NULL,
    "approved_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fee_exemptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "students_student_number_key" ON "public"."students"("student_number");

-- CreateIndex
CREATE UNIQUE INDEX "academic_years_name_key" ON "public"."academic_years"("name");

-- CreateIndex
CREATE UNIQUE INDEX "fee_categories_code_key" ON "public"."fee_categories"("code");

-- CreateIndex
CREATE UNIQUE INDEX "student_fee_payments_receipt_number_key" ON "public"."student_fee_payments"("receipt_number");

-- CreateIndex
CREATE UNIQUE INDEX "student_balances_student_id_fee_structure_id_balance_type_key" ON "public"."student_balances"("student_id", "fee_structure_id", "balance_type");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."branches" ADD CONSTRAINT "branches_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."members" ADD CONSTRAINT "members_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."students" ADD CONSTRAINT "students_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."students" ADD CONSTRAINT "students_branch_code_fkey" FOREIGN KEY ("branch_code") REFERENCES "public"."branches"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."students" ADD CONSTRAINT "students_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "public"."academic_years"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."academic_years" ADD CONSTRAINT "academic_years_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fee_categories" ADD CONSTRAINT "fee_categories_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fee_structures" ADD CONSTRAINT "fee_structures_fee_category_id_fkey" FOREIGN KEY ("fee_category_id") REFERENCES "public"."fee_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fee_structures" ADD CONSTRAINT "fee_structures_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "public"."academic_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fee_structures" ADD CONSTRAINT "fee_structures_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fee_structures" ADD CONSTRAINT "fee_structures_currency_code_fkey" FOREIGN KEY ("currency_code") REFERENCES "public"."currencies"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student_fee_payments" ADD CONSTRAINT "student_fee_payments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student_fee_payments" ADD CONSTRAINT "student_fee_payments_fee_structure_id_fkey" FOREIGN KEY ("fee_structure_id") REFERENCES "public"."fee_structures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student_fee_payments" ADD CONSTRAINT "student_fee_payments_currency_code_fkey" FOREIGN KEY ("currency_code") REFERENCES "public"."currencies"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student_fee_payments" ADD CONSTRAINT "student_fee_payments_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "public"."payment_methods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student_fee_payments" ADD CONSTRAINT "student_fee_payments_processed_by_fkey" FOREIGN KEY ("processed_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student_balances" ADD CONSTRAINT "student_balances_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student_balances" ADD CONSTRAINT "student_balances_currency_code_fkey" FOREIGN KEY ("currency_code") REFERENCES "public"."currencies"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student_balance_adjustments" ADD CONSTRAINT "student_balance_adjustments_student_balance_id_fkey" FOREIGN KEY ("student_balance_id") REFERENCES "public"."student_balances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student_balance_adjustments" ADD CONSTRAINT "student_balance_adjustments_processed_by_fkey" FOREIGN KEY ("processed_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fee_reminders" ADD CONSTRAINT "fee_reminders_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fee_reminders" ADD CONSTRAINT "fee_reminders_currency_code_fkey" FOREIGN KEY ("currency_code") REFERENCES "public"."currencies"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fee_reminders" ADD CONSTRAINT "fee_reminders_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fee_exemptions" ADD CONSTRAINT "fee_exemptions_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fee_exemptions" ADD CONSTRAINT "fee_exemptions_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."revenue_heads" ADD CONSTRAINT "revenue_heads_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."expenditure_heads" ADD CONSTRAINT "expenditure_heads_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."projects" ADD CONSTRAINT "projects_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."expenditures" ADD CONSTRAINT "expenditures_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."assets" ADD CONSTRAINT "assets_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;