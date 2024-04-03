/*
  Warnings:

  - A unique constraint covering the columns `[experimentId,sample]` on the table `Assay` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sample` to the `Assay` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weeks` to the `Experiment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assay" ADD COLUMN     "sample" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Experiment" ADD COLUMN     "weeks" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Assay_experimentId_sample_key" ON "Assay"("experimentId", "sample");
