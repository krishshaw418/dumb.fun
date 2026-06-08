/*
  Warnings:

  - You are about to drop the column `name` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `symbol` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Token` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Token" DROP COLUMN "name",
DROP COLUMN "symbol",
DROP COLUMN "url",
ALTER COLUMN "createdAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "TokenMetaData" (
    "mint" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "TokenMetaData_pkey" PRIMARY KEY ("mint")
);

-- AddForeignKey
ALTER TABLE "TokenMetaData" ADD CONSTRAINT "TokenMetaData_mint_fkey" FOREIGN KEY ("mint") REFERENCES "Token"("mint") ON DELETE RESTRICT ON UPDATE CASCADE;
