/*
  Warnings:

  - You are about to drop the column `questionNumber` on the `CodingQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `lessonId` on the `TestCases` table. All the data in the column will be lost.
  - You are about to drop the column `questionNumber` on the `TestCases` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[codingQuestionId]` on the table `TestCases` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `codingQuestionId` to the `TestCases` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TestCases" DROP CONSTRAINT "TestCases_lessonId_questionNumber_fkey";

-- DropIndex
DROP INDEX "CodingQuestion_lessonId_questionNumber_key";

-- AlterTable
ALTER TABLE "CodingQuestion" DROP COLUMN "questionNumber";

-- AlterTable
ALTER TABLE "TestCases" DROP COLUMN "lessonId",
DROP COLUMN "questionNumber",
ADD COLUMN     "codingQuestionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TestCases_codingQuestionId_key" ON "TestCases"("codingQuestionId");

-- AddForeignKey
ALTER TABLE "TestCases" ADD CONSTRAINT "TestCases_codingQuestionId_fkey" FOREIGN KEY ("codingQuestionId") REFERENCES "CodingQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
