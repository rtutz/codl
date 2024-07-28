-- CreateTable
CREATE TABLE "ModelUserCodingMap" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "userId" TEXT NOT NULL,
    "codingQuestionId" TEXT NOT NULL,

    CONSTRAINT "ModelUserCodingMap_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ModelUserCodingMap_id_key" ON "ModelUserCodingMap"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ModelUserCodingMap_userId_codingQuestionId_key" ON "ModelUserCodingMap"("userId", "codingQuestionId");

-- AddForeignKey
ALTER TABLE "ModelUserCodingMap" ADD CONSTRAINT "ModelUserCodingMap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelUserCodingMap" ADD CONSTRAINT "ModelUserCodingMap_codingQuestionId_fkey" FOREIGN KEY ("codingQuestionId") REFERENCES "CodingQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
