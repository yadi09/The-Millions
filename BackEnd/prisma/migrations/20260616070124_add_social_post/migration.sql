-- CreateTable
CREATE TABLE "social_post" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "templateType" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "imageUrl" TEXT,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "social_post_userId_updatedAt_idx" ON "social_post"("userId", "updatedAt");

-- AddForeignKey
ALTER TABLE "social_post" ADD CONSTRAINT "social_post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
