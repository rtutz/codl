/*
  Warnings:

  - A unique constraint covering the columns `[lessonId,questionNumber]` on the table `CodingQuestion` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "TestCases" DROP CONSTRAINT "TestCases_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "TestCases" DROP CONSTRAINT "TestCases_questionNumber_fkey";

-- DropIndex
DROP INDEX "CodingQuestion_questionNumber_key";

-- AlterTable
ALTER TABLE "CodingQuestion" ALTER COLUMN "questionNumber" DROP DEFAULT;
DROP SEQUENCE "CodingQuestion_questionNumber_seq";

-- CreateIndex
CREATE UNIQUE INDEX "CodingQuestion_lessonId_questionNumber_key" ON "CodingQuestion"("lessonId", "questionNumber");

-- AddForeignKey
ALTER TABLE "TestCases" ADD CONSTRAINT "TestCases_lessonId_questionNumber_fkey" FOREIGN KEY ("lessonId", "questionNumber") REFERENCES "CodingQuestion"("lessonId", "questionNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
