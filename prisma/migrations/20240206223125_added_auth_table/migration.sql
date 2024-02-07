/*
  Warnings:

  - You are about to drop the `AuthTable` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "AuthTable";

-- CreateTable
CREATE TABLE "Auth" (
    "id" SERIAL NOT NULL,
    "password" TEXT NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("id")
);
