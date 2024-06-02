/*
  Warnings:

  - Added the required column `dueDate` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "UserLessonMap" (
    "userID" TEXT NOT NULL,
    "lessonID" TEXT NOT NULL,
    "submitted" BOOLEAN NOT NULL,

    CONSTRAINT "UserLessonMap_pkey" PRIMARY KEY ("userID","lessonID")
);

-- AddForeignKey
ALTER TABLE "UserLessonMap" ADD CONSTRAINT "UserLessonMap_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLessonMap" ADD CONSTRAINT "UserLessonMap_lessonID_fkey" FOREIGN KEY ("lessonID") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
