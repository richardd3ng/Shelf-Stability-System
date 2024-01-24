-- CreateTable
CREATE TABLE "Experiment" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Experiment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assay" (
    "id" SERIAL NOT NULL,
    "experimentId" INTEGER NOT NULL,
    "conditionId" INTEGER NOT NULL,
    "typeId" INTEGER NOT NULL,
    "target_date" TIMESTAMP(3) NOT NULL,
    "result" TEXT,

    CONSTRAINT "Assay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssayType" (
    "id" SERIAL NOT NULL,
    "experimentId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AssayType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Condition" (
    "id" SERIAL NOT NULL,
    "experimentId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "control" BOOLEAN DEFAULT false,

    CONSTRAINT "Condition_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Assay" ADD CONSTRAINT "Assay_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "Experiment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assay" ADD CONSTRAINT "Assay_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "Condition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assay" ADD CONSTRAINT "Assay_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "AssayType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssayType" ADD CONSTRAINT "AssayType_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "Experiment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Condition" ADD CONSTRAINT "Condition_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "Experiment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
