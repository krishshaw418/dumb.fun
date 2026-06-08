import z from "zod";

export const envSchema = z.object({
    PORT: z.coerce.number(),
    DATABASE_URL: z.url()
});

export const newTokenSchema = z.object({
    mint: z.string().regex(/^[1-9A-HJ-NP-Za-km-z]+$/, "Invalid mint address!"),
    creator: z.string().regex(/^[1-9A-HJ-NP-Za-km-z]+$/, "Invalid public key!"),
    name: z.string().max(50, "Max 50 characters allowed!"),
    symbol: z.string().max(10, "Max 10 characters allowed!"),
    url: z.url().max(2048, "Max 2,048 characters allowed!"),
});
