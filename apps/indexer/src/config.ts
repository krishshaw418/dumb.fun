import "dotenv/config";
import { envSchema } from "./schema";

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error("Error: ", parsedEnv.error);
    process.exit(1);
}

export const config = {
    rpcUrl: parsedEnv.data.RPC_URL,
    grpcUrl: parsedEnv.data.GRPC_URL
}