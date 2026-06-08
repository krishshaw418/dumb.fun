/*
  Warnings:

  - You are about to drop the `TokenMetaData` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `Token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symbol` to the `Token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TokenMetaData" DROP CONSTRAINT "TokenMetaData_mint_fkey";

-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "symbol" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;

-- DropTable
DROP TABLE "TokenMetaData";
