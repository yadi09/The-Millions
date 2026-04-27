-- CreateTable
CREATE TABLE "Footer" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "socialMedia" JSONB NOT NULL,
    "copyright" TEXT NOT NULL,

    CONSTRAINT "Footer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Footer_pageId_key" ON "Footer"("pageId");

-- AddForeignKey
ALTER TABLE "Footer" ADD CONSTRAINT "Footer_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
