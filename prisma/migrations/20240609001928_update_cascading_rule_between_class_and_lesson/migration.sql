-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_classId_fkey";

-- DropForeignKey
ALTER TABLE "UserLessonMap" DROP CONSTRAINT "UserLessonMap_lessonID_fkey";

-- DropForeignKey
ALTER TABLE "UserLessonMap" DROP CONSTRAINT "UserLessonMap_userID_fkey";

-- AddForeignKey
ALTER TABLE "UserLessonMap" ADD CONSTRAINT "UserLessonMap_lessonID_fkey" FOREIGN KEY ("lessonID") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLessonMap" ADD CONSTRAINT "UserLessonMap_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;
