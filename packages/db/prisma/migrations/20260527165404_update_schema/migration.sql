/*
  Warnings:

  - You are about to drop the column `uri` on the `Token` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BondingCurveState" ALTER COLUMN "supply" SET DEFAULT 0,
ALTER COLUMN "reserve" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Token" DROP COLUMN "uri",
ADD COLUMN     "url" TEXT;
