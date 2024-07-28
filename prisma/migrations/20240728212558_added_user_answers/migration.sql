-- CreateTable
CREATE TABLE "userAnswers" (
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "userAnswers_pkey" PRIMARY KEY ("userId","questionId")
);
