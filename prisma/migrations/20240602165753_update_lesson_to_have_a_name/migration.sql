/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "id" SET DEFAULT gen_random_uuid(),
ALTER COLUMN "dueDate" DROP NOT NULL,
ALTER COLUMN "dueDate" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "dueDate" SET DATA TYPE TIMESTAMPTZ(6);

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_id_key" ON "Lesson"("id");
