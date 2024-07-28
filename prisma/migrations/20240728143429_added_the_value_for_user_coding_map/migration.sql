/*
  Warnings:

  - You are about to drop the `ModelUserCodingMap` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ModelUserCodingMap" DROP CONSTRAINT "ModelUserCodingMap_codingQuestionId_fkey";

-- DropForeignKey
ALTER TABLE "ModelUserCodingMap" DROP CONSTRAINT "ModelUserCodingMap_userId_fkey";

-- DropTable
DROP TABLE "ModelUserCodingMap";

-- CreateTable
CREATE TABLE "UserCodingMap" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "userId" TEXT NOT NULL,
    "codingQuestionId" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "UserCodingMap_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserCodingMap_id_key" ON "UserCodingMap"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserCodingMap_userId_codingQuestionId_key" ON "UserCodingMap"("userId", "codingQuestionId");

-- AddForeignKey
ALTER TABLE "UserCodingMap" ADD CONSTRAINT "UserCodingMap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCodingMap" ADD CONSTRAINT "UserCodingMap_codingQuestionId_fkey" FOREIGN KEY ("codingQuestionId") REFERENCES "CodingQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
