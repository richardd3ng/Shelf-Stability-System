-- DropForeignKey
ALTER TABLE "Assay" DROP CONSTRAINT "Assay_conditionId_fkey";

-- AddForeignKey
ALTER TABLE "Assay" ADD CONSTRAINT "Assay_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "Condition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
