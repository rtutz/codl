/*
  Warnings:

  - The primary key for the `Quiz` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `choice1` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `choice2` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `choice3` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `choice4` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `correctAnswer` on the `Quiz` table. All the data in the column will be lost.
  - The `id` column on the `Quiz` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropIndex
DROP INDEX "Quiz_id_key";

-- AlterTable
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_pkey",
DROP COLUMN "choice1",
DROP COLUMN "choice2",
DROP COLUMN "choice3",
DROP COLUMN "choice4",
DROP COLUMN "correctAnswer",
ADD COLUMN     "hint" TEXT,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Choice" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "questionId" INTEGER NOT NULL,

    CONSTRAINT "Choice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Choice" ADD CONSTRAINT "Choice_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
