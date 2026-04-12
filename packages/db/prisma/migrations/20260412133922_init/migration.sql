-- CreateEnum
CREATE TYPE "Direction" AS ENUM ('buy', 'sell');

-- CreateTable
CREATE TABLE "Token" (
    "mint" TEXT NOT NULL,
    "creator" TEXT NOT NULL,
    "name" TEXT,
    "symbol" TEXT,
    "uri" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("mint")
);

-- CreateTable
CREATE TABLE "Trade" (
    "id" TEXT NOT NULL,
    "mint" TEXT NOT NULL,
    "direction" "Direction" NOT NULL,
    "user" TEXT NOT NULL,
    "solAmount" BIGINT NOT NULL,
    "tokenAmount" BIGINT NOT NULL,
    "timeStamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BondingCurveState" (
    "mint" TEXT NOT NULL,
    "creator" TEXT NOT NULL,
    "supply" BIGINT NOT NULL,
    "reserve" BIGINT NOT NULL,
    "is_migrated" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BondingCurveState_pkey" PRIMARY KEY ("mint")
);

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_mint_fkey" FOREIGN KEY ("mint") REFERENCES "Token"("mint") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BondingCurveState" ADD CONSTRAINT "BondingCurveState_mint_fkey" FOREIGN KEY ("mint") REFERENCES "Token"("mint") ON DELETE RESTRICT ON UPDATE CASCADE;
