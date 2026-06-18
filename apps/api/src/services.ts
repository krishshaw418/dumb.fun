import { prisma } from "db";
import { Token } from "types";

export const createNewToken = async (data: Token) => {
    try {
        const newTokenMetaData = data;

        await prisma.token.create({
            data: newTokenMetaData
        });

    } catch (error: any) {
        throw error;
    }
}

export const fetchAllCoins = async () => {
    try {
        const tokens: Token[] = await prisma.token.findMany();
        return tokens;
    } catch (error) {
        throw error;
    }
}

export const fetchCoin = async (mint: string) => {
    try {
        const token = await prisma.token.findUnique({
            where: {
                mint
            }
        });

        return token;
    } catch (error) {
        throw error;
    }
}
