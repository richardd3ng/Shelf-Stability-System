/*
  Warnings:

  - You are about to drop the column `result` on the `Assay` table. All the data in the column will be lost.
  - You are about to drop the column `target_date` on the `Assay` table. All the data in the column will be lost.
  - You are about to drop the column `typeId` on the `Assay` table. All the data in the column will be lost.
  - You are about to drop the `AssayType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Auth` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[experimentId,conditionId,week,type]` on the table `Assay` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[experimentId,name]` on the table `Condition` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Assay` table without a default value. This is not possible if the table is not empty.
  - Added the required column `week` to the `Assay` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `Experiment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Assay" DROP CONSTRAINT "Assay_typeId_fkey";

-- DropForeignKey
ALTER TABLE "AssayType" DROP CONSTRAINT "AssayType_experimentId_fkey";

-- AlterTable
ALTER TABLE "Assay" DROP COLUMN "result",
DROP COLUMN "target_date",
DROP COLUMN "typeId",
ADD COLUMN     "type" INTEGER NOT NULL,
ADD COLUMN     "week" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Experiment" ADD COLUMN     "ownerId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "AssayType";

-- DropTable
DROP TABLE "Auth";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "is_admin" BOOLEAN DEFAULT false,
    "is_super_admin" BOOLEAN DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssayResult" (
    "id" SERIAL NOT NULL,
    "assayId" INTEGER NOT NULL,
    "result" DOUBLE PRECISION,
    "comment" TEXT,
    "last_editor" TEXT NOT NULL,

    CONSTRAINT "AssayResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "AssayResult_assayId_key" ON "AssayResult"("assayId");

-- CreateIndex
CREATE UNIQUE INDEX "Assay_experimentId_conditionId_week_type_key" ON "Assay"("experimentId", "conditionId", "week", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Condition_experimentId_name_key" ON "Condition"("experimentId", "name");

-- AddForeignKey
ALTER TABLE "Experiment" ADD CONSTRAINT "Experiment_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssayResult" ADD CONSTRAINT "AssayResult_assayId_fkey" FOREIGN KEY ("assayId") REFERENCES "Assay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
