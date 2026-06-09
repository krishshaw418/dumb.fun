import { createServer } from "./server";
import { config } from "./config";

async function main() {
    const app = createServer();

    let startTime = Date.now();
    app.listen(config.port, () => {
        console.log(`Server listening at port: ${config.port}...`);
    });
    let endTime = Date.now();
    console.log(`Time to start server: ${endTime - startTime} ms`);
}

main().catch((err) => {
    console.error("Error starting server: ", err);
    process.exit(1);
});