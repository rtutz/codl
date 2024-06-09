/*
  Warnings:

  - The primary key for the `Quiz` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `answer` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `choices` on the `Quiz` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Quiz` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `choice1` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `choice2` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `choice3` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `choice4` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `correctAnswer` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `questionNumber` to the `TestCases` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_pkey",
DROP COLUMN "answer",
DROP COLUMN "choices",
ADD COLUMN     "choice1" TEXT NOT NULL,
ADD COLUMN     "choice2" TEXT NOT NULL,
ADD COLUMN     "choice3" TEXT NOT NULL,
ADD COLUMN     "choice4" TEXT NOT NULL,
ADD COLUMN     "correctAnswer" INTEGER NOT NULL,
ALTER COLUMN "id" SET DEFAULT gen_random_uuid(),
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Quiz_id_seq";

-- AlterTable
ALTER TABLE "TestCases" ADD COLUMN     "questionNumber" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "CodingQuestion" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "lessonId" TEXT NOT NULL,
    "questionNumber" SERIAL NOT NULL,
    "markdown" TEXT NOT NULL,

    CONSTRAINT "CodingQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CodingQuestion_id_key" ON "CodingQuestion"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CodingQuestion_questionNumber_key" ON "CodingQuestion"("questionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_id_key" ON "Quiz"("id");

-- AddForeignKey
ALTER TABLE "CodingQuestion" ADD CONSTRAINT "CodingQuestion_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestCases" ADD CONSTRAINT "TestCases_questionNumber_fkey" FOREIGN KEY ("questionNumber") REFERENCES "CodingQuestion"("questionNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
