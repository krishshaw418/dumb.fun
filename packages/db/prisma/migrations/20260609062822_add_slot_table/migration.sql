-- CreateTable
CREATE TABLE "LatestSlot" (
    "id" TEXT NOT NULL,
    "slotNumber" BIGINT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LatestSlot_pkey" PRIMARY KEY ("id")
);
