/*
  Warnings:

  - You are about to drop the column `project_id` on the `transactions` table. All the data in the column will be lost.
  - Made the column `revenue_head_code` on table `transactions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."transactions" DROP CONSTRAINT "transactions_project_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."transactions" DROP CONSTRAINT "transactions_revenue_head_code_fkey";

-- AlterTable
ALTER TABLE "public"."transactions" DROP COLUMN "project_id",
ALTER COLUMN "revenue_head_code" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_revenue_head_code_fkey" FOREIGN KEY ("revenue_head_code") REFERENCES "public"."revenue_heads"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
