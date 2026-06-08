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
