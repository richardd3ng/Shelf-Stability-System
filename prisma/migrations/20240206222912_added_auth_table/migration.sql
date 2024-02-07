/*
  Warnings:

  - You are about to drop the `Auth` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Auth";

-- CreateTable
CREATE TABLE "AuthTable" (
    "id" SERIAL NOT NULL,
    "password" TEXT NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthTable_pkey" PRIMARY KEY ("id")
);
