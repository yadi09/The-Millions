-- CreateTable
CREATE TABLE "feedback_submission" (
    "id" TEXT NOT NULL,
    "submittedBy" TEXT NOT NULL,
    "overallRating" INTEGER,
    "overallComment" TEXT,
    "responses" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback_submission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "feedback_submission_createdAt_idx" ON "feedback_submission"("createdAt");