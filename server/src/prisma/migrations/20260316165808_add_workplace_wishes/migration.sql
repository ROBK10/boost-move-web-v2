-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "bio" TEXT;

-- CreateTable
CREATE TABLE "WorkplaceWish" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "selected" TEXT[],
    "annetText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkplaceWish_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WorkplaceWish_companyId_month_idx" ON "WorkplaceWish"("companyId", "month");

-- AddForeignKey
ALTER TABLE "WorkplaceWish" ADD CONSTRAINT "WorkplaceWish_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
