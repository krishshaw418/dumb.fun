import { PrismaClient } from "../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    console.error("Error: connectionString undefined!");
    process.exit(1);
}
const adapter = new PrismaPg(connectionString);
const prisma = new PrismaClient({ adapter });

export { prisma };