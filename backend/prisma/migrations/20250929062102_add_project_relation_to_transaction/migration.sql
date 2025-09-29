-- DropForeignKey
ALTER TABLE "public"."transactions" DROP CONSTRAINT "transactions_revenue_head_code_fkey";

-- AlterTable
ALTER TABLE "public"."transactions" ADD COLUMN     "project_id" INTEGER,
ALTER COLUMN "revenue_head_code" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_revenue_head_code_fkey" FOREIGN KEY ("revenue_head_code") REFERENCES "public"."revenue_heads"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
