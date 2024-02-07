-- DropForeignKey
ALTER TABLE "Assay" DROP CONSTRAINT "Assay_experimentId_fkey";

-- DropForeignKey
ALTER TABLE "AssayType" DROP CONSTRAINT "AssayType_experimentId_fkey";

-- DropForeignKey
ALTER TABLE "Condition" DROP CONSTRAINT "Condition_experimentId_fkey";

-- CreateTable
CREATE TABLE "Auth" (
    "id" SERIAL NOT NULL,
    "password" TEXT NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Assay" ADD CONSTRAINT "Assay_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "Experiment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssayType" ADD CONSTRAINT "AssayType_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "Experiment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Condition" ADD CONSTRAINT "Condition_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "Experiment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
