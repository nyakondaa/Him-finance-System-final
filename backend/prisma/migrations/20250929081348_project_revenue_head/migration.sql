/*
  Warnings:

  - A unique constraint covering the columns `[revenue_head_code]` on the table `projects` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."projects" ADD COLUMN     "revenue_head_code" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "projects_revenue_head_code_key" ON "public"."projects"("revenue_head_code");

-- AddForeignKey
ALTER TABLE "public"."projects" ADD CONSTRAINT "projects_revenue_head_code_fkey" FOREIGN KEY ("revenue_head_code") REFERENCES "public"."revenue_heads"("code") ON DELETE SET NULL ON UPDATE CASCADE;
