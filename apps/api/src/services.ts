import { prisma } from "db";
import { TokenMetaData } from "types";

export const createNewToken = async (data: TokenMetaData) => {
    try {
        const newTokenMetaData = data;
        const newToken = await prisma.token.findUnique({
            where: {
                mint: newTokenMetaData.mint,
                creator: newTokenMetaData.creator
            }
        });

        if (!newToken) {
            throw new Error("can't create new token metadata record because new token not found!");
        }

        await prisma.tokenMetaData.create({
            data: newTokenMetaData
        });

    } catch (error: any) {
        throw error;
    }
}
