-- CreateTable
CREATE TABLE "BoostEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "durationSeconds" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BoostEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MinHelseCheckin" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "context" TEXT NOT NULL,
    "capacityScore" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MinHelseCheckin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BoostEntry_userId_completedAt_idx" ON "BoostEntry"("userId", "completedAt");

-- CreateIndex
CREATE INDEX "MinHelseCheckin_userId_date_idx" ON "MinHelseCheckin"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "MinHelseCheckin_userId_date_key" ON "MinHelseCheckin"("userId", "date");

-- AddForeignKey
ALTER TABLE "BoostEntry" ADD CONSTRAINT "BoostEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MinHelseCheckin" ADD CONSTRAINT "MinHelseCheckin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
