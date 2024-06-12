/*
  Warnings:

  - The primary key for the `TestCases` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `TestCases` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "TestCases" DROP CONSTRAINT "TestCases_pkey",
ALTER COLUMN "id" SET DEFAULT gen_random_uuid(),
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "TestCases_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "TestCases_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "TestCases_id_key" ON "TestCases"("id");
