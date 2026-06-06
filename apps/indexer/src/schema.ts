import z from "zod";

export const envSchema = z.object({
    RPC_URL: z.url(),
    GRPC_URL: z.url()
});