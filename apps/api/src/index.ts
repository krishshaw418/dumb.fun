import { createServer } from "./server";
import { config } from "./config";

async function main() {
    const app = createServer();

    app.listen(config.port, () => {
        console.log(`Server listening at port: ${config.port}...`);
    })
}

main().catch((err) => {
    console.error("Error starting server: ", err);
    process.exit(1);
});