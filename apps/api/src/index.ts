import { createServers } from "./server";
import { config } from "./config";
import type WebSocket from "ws";
import { socketMsg, newTokenSchema } from "./schema";
import { createNewToken } from "./services";

async function main() {
  const { server, wss } = createServers();

  wss.on("connection", (ws: WebSocket) => {
    console.log("New client connected!");

    ws.on("message", async (msg) => {
      const msgJSON = JSON.parse(msg.toString());
      const parsed = socketMsg.safeParse(msgJSON);

      if (!parsed.success) {
        return ws.send(
          JSON.stringify({
            error: JSON.parse(parsed.error.message),
          }),
        );
      } else {
        switch (parsed.data.event) {
          case "new-token": {
            console.log("Received data: ", parsed.data.data);
            const parsedData = newTokenSchema.safeParse(parsed.data.data);

            if (!parsedData.success) {
              return ws.send(
                JSON.stringify({
                  error: JSON.parse(parsedData.error.message),
                }),
              );
            }

            try {
              await createNewToken({
                ...parsedData.data,
                createdAt: new Date(parsedData.data.createdAt),
              });

              wss.clients.forEach((client: WebSocket) => {
                client.send(
                  JSON.stringify({
                    event: "token-create",
                    data: JSON.stringify({
                      ...parsedData.data,
                    }),
                  }),
                );
              });
            } catch (error) {
              console.error(error);
              ws.send(
                JSON.stringify({
                  error: "Failed to create token, something went wrong!",
                }),
              );
            }
            break;
          }
          default: {
            ws.send(
              JSON.stringify({
                event: "error",
                data: "Invalid event type!",
              }),
            );
            break;
          }
        }
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected!");
    });
  });

  let startTime = Date.now();
  server.listen(config.port, () => {
    console.log(`Server listening at port: ${config.port}...`);
  });
  let endTime = Date.now();
  console.log(`Time to start server: ${endTime - startTime} ms`);
}

main().catch((err) => {
  console.error("Error starting server: ", err);
  process.exit(1);
});
