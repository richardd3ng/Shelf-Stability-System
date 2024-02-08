/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Experiment` will be added. If there are existing duplicate values, this will fail.

*/

-- CreateIndex
CREATE UNIQUE INDEX "Experiment_title_key" ON "Experiment"("title");
