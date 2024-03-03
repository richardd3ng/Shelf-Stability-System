/*
  Warnings:

  - You are about to drop the column `type` on the `Assay` table. All the data in the column will be lost.
  - You are about to drop the column `last_editor` on the `AssayResult` table. All the data in the column will be lost.
  - You are about to drop the column `control` on the `Condition` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `Experiment` table. All the data in the column will be lost.
  - You are about to drop the column `is_admin` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `is_super_admin` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[experimentId,conditionId,week,assayTypeId]` on the table `Assay` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `assayTypeId` to the `Assay` table without a default value. This is not possible if the table is not empty.
  - Added the required column `author` to the `AssayResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isControl` to the `Condition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isCanceled` to the `Experiment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Experiment` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Experiment` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `displayName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isSSO` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Assay_experimentId_conditionId_week_type_key";

-- AlterTable
ALTER TABLE "Assay" DROP COLUMN "type",
ADD COLUMN     "assayTypeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "AssayResult" DROP COLUMN "last_editor",
ADD COLUMN     "author" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Condition" DROP COLUMN "control",
ADD COLUMN     "isControl" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Experiment" DROP COLUMN "start_date",
ADD COLUMN     "isCanceled" BOOLEAN NOT NULL,
ADD COLUMN     "startDate" DATE NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "is_admin",
DROP COLUMN "is_super_admin",
ADD COLUMN     "displayName" TEXT NOT NULL,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSSO" BOOLEAN NOT NULL,
ADD COLUMN     "isSuperAdmin" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateTable
CREATE TABLE "AssayType" (
    "id" SERIAL NOT NULL,
    "isCustom" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "units" TEXT,

    CONSTRAINT "AssayType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssayTypeForExperiment" (
    "id" SERIAL NOT NULL,
    "assayTypeId" INTEGER NOT NULL,
    "experimentId" INTEGER NOT NULL,
    "technicianId" INTEGER,

    CONSTRAINT "AssayTypeForExperiment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssayTypeForExperiment_experimentId_assayTypeId_key" ON "AssayTypeForExperiment"("experimentId", "assayTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "Assay_experimentId_conditionId_week_assayTypeId_key" ON "Assay"("experimentId", "conditionId", "week", "assayTypeId");

-- AddForeignKey
ALTER TABLE "Assay" ADD CONSTRAINT "Assay_assayTypeId_fkey" FOREIGN KEY ("assayTypeId") REFERENCES "AssayTypeForExperiment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssayTypeForExperiment" ADD CONSTRAINT "AssayTypeForExperiment_assayTypeId_fkey" FOREIGN KEY ("assayTypeId") REFERENCES "AssayType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssayTypeForExperiment" ADD CONSTRAINT "AssayTypeForExperiment_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "Experiment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssayTypeForExperiment" ADD CONSTRAINT "AssayTypeForExperiment_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
