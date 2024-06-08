/*
  Warnings:

  - The primary key for the `Class` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `UserClassMap` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_classId_fkey";

-- DropForeignKey
ALTER TABLE "UserClassMap" DROP CONSTRAINT "UserClassMap_classID_fkey";

-- AlterTable
ALTER TABLE "Class" DROP CONSTRAINT "Class_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Class_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Class_id_seq";

-- AlterTable
ALTER TABLE "Lesson" ALTER COLUMN "classId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "UserClassMap" DROP CONSTRAINT "UserClassMap_pkey",
ALTER COLUMN "classID" SET DATA TYPE TEXT,
ADD CONSTRAINT "UserClassMap_pkey" PRIMARY KEY ("userID", "classID");

-- AddForeignKey
ALTER TABLE "UserClassMap" ADD CONSTRAINT "UserClassMap_classID_fkey" FOREIGN KEY ("classID") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
