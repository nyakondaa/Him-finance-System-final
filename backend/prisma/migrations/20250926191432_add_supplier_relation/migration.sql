/*
  Warnings:

  - You are about to drop the column `organization_id` on the `assets` table. All the data in the column will be lost.
  - You are about to drop the column `organization_id` on the `branches` table. All the data in the column will be lost.
  - You are about to drop the column `organization_id` on the `expenditure_heads` table. All the data in the column will be lost.
  - You are about to drop the column `organization_id` on the `expenditures` table. All the data in the column will be lost.
  - You are about to drop the column `supplier_id` on the `expenditures` table. All the data in the column will be lost.
  - You are about to drop the column `organization_id` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `organization_id` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `organization_id` on the `revenue_heads` table. All the data in the column will be lost.
  - You are about to drop the column `organization_id` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `organization_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `academic_years` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `fee_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `fee_exemptions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `fee_reminders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `fee_structures` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `organizations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `student_balance_adjustments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `student_balances` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `student_fee_payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `students` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."academic_years" DROP CONSTRAINT "academic_years_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."assets" DROP CONSTRAINT "assets_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."branches" DROP CONSTRAINT "branches_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."expenditure_heads" DROP CONSTRAINT "expenditure_heads_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."expenditures" DROP CONSTRAINT "expenditures_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."expenditures" DROP CONSTRAINT "expenditures_supplier_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."fee_categories" DROP CONSTRAINT "fee_categories_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."fee_exemptions" DROP CONSTRAINT "fee_exemptions_approved_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."fee_exemptions" DROP CONSTRAINT "fee_exemptions_student_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."fee_reminders" DROP CONSTRAINT "fee_reminders_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."fee_reminders" DROP CONSTRAINT "fee_reminders_currency_code_fkey";

-- DropForeignKey
ALTER TABLE "public"."fee_reminders" DROP CONSTRAINT "fee_reminders_student_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."fee_structures" DROP CONSTRAINT "fee_structures_academic_year_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."fee_structures" DROP CONSTRAINT "fee_structures_currency_code_fkey";

-- DropForeignKey
ALTER TABLE "public"."fee_structures" DROP CONSTRAINT "fee_structures_fee_category_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."fee_structures" DROP CONSTRAINT "fee_structures_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."members" DROP CONSTRAINT "members_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."projects" DROP CONSTRAINT "projects_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."revenue_heads" DROP CONSTRAINT "revenue_heads_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."student_balance_adjustments" DROP CONSTRAINT "student_balance_adjustments_processed_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."student_balance_adjustments" DROP CONSTRAINT "student_balance_adjustments_student_balance_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."student_balances" DROP CONSTRAINT "student_balances_currency_code_fkey";

-- DropForeignKey
ALTER TABLE "public"."student_balances" DROP CONSTRAINT "student_balances_student_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."student_fee_payments" DROP CONSTRAINT "student_fee_payments_currency_code_fkey";

-- DropForeignKey
ALTER TABLE "public"."student_fee_payments" DROP CONSTRAINT "student_fee_payments_fee_structure_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."student_fee_payments" DROP CONSTRAINT "student_fee_payments_payment_method_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."student_fee_payments" DROP CONSTRAINT "student_fee_payments_processed_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."student_fee_payments" DROP CONSTRAINT "student_fee_payments_student_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."students" DROP CONSTRAINT "students_academic_year_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."students" DROP CONSTRAINT "students_branch_code_fkey";

-- DropForeignKey
ALTER TABLE "public"."students" DROP CONSTRAINT "students_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."transactions" DROP CONSTRAINT "transactions_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_organization_id_fkey";

-- AlterTable
ALTER TABLE "public"."assets" DROP COLUMN "organization_id";

-- AlterTable
ALTER TABLE "public"."branches" DROP COLUMN "organization_id";

-- AlterTable
ALTER TABLE "public"."expenditure_heads" DROP COLUMN "organization_id";

-- AlterTable
ALTER TABLE "public"."expenditures" DROP COLUMN "organization_id",
DROP COLUMN "supplier_id";

-- AlterTable
ALTER TABLE "public"."members" DROP COLUMN "organization_id";

-- AlterTable
ALTER TABLE "public"."projects" DROP COLUMN "organization_id";

-- AlterTable
ALTER TABLE "public"."revenue_heads" DROP COLUMN "organization_id";

-- AlterTable
ALTER TABLE "public"."transactions" DROP COLUMN "organization_id";

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "organization_id";

-- DropTable
DROP TABLE "public"."academic_years";

-- DropTable
DROP TABLE "public"."fee_categories";

-- DropTable
DROP TABLE "public"."fee_exemptions";

-- DropTable
DROP TABLE "public"."fee_reminders";

-- DropTable
DROP TABLE "public"."fee_structures";

-- DropTable
DROP TABLE "public"."organizations";

-- DropTable
DROP TABLE "public"."student_balance_adjustments";

-- DropTable
DROP TABLE "public"."student_balances";

-- DropTable
DROP TABLE "public"."student_fee_payments";

-- DropTable
DROP TABLE "public"."students";

-- DropEnum
DROP TYPE "public"."ExemptionType";

-- DropEnum
DROP TYPE "public"."Gender";

-- DropEnum
DROP TYPE "public"."OrganizationType";

-- DropEnum
DROP TYPE "public"."PaymentStatus";
