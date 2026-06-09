/*
  Warnings:

  - You are about to drop the `LatestSlot` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "LatestSlot";

-- CreateTable
CREATE TABLE "LatestTxn" (
    "id" TEXT NOT NULL,
    "sig" TEXT NOT NULL,
    "slot" BIGINT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LatestTxn_pkey" PRIMARY KEY ("id")
);
