import "dotenv/config";
import { envSchema } from "./schema";

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error("Error loading env: ", parsedEnv.error);
    process.exit(1);
}

export const config = {
    port: parsedEnv.data.PORT,
    db_url: parsedEnv.data.DATABASE_URL
}