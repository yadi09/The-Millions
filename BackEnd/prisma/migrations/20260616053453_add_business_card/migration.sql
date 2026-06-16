-- CreateTable
CREATE TABLE "business_card" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "tagline" TEXT,
    "email" TEXT,
    "phoneMobile" TEXT,
    "phoneOffice" TEXT,
    "website" TEXT,
    "address" TEXT[],
    "template" TEXT NOT NULL DEFAULT 'minimal',
    "showQrCode" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_card_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "business_card_userId_key" ON "business_card"("userId");

-- AddForeignKey
ALTER TABLE "business_card" ADD CONSTRAINT "business_card_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
