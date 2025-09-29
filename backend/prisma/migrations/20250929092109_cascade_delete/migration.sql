-- DropForeignKey
ALTER TABLE "public"."projects" DROP CONSTRAINT "projects_revenue_head_code_fkey";

-- AddForeignKey
ALTER TABLE "public"."projects" ADD CONSTRAINT "projects_revenue_head_code_fkey" FOREIGN KEY ("revenue_head_code") REFERENCES "public"."revenue_heads"("code") ON DELETE CASCADE ON UPDATE CASCADE;
