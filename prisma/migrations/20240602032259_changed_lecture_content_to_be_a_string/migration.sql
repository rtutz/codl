/*
  Warnings:

  - You are about to drop the column `lecture` on the `Lesson` table. All the data in the column will be lost.
  - Added the required column `lectureContent` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "lecture",
ADD COLUMN     "lectureContent" TEXT NOT NULL;
