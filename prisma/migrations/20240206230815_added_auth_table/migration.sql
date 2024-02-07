/*
  Warnings:

  - You are about to drop the column `userId` on the `Auth` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `Auth` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `Auth` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Auth_userId_key";

-- AlterTable
ALTER TABLE "Auth" DROP COLUMN "userId",
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Auth_username_key" ON "Auth"("username");
