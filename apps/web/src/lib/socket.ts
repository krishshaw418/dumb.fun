import z from "zod";

class getSocketInstance {
  private static instance: WebSocket;

  static getInstance(): WebSocket {
    if (!this.instance) {
      this.instance = new WebSocket(import.meta.env.VITE_BASE_SOCKET_URL);
    }

    return this.instance;
  }
}

export const ws = getSocketInstance.getInstance();

export const socketMsg = z.object({
  event: z.string(),
  data: z.any(),
});

ws.onmessage = (event) => {
  const msgJSON = JSON.parse(event.data);
  const parsed = socketMsg.safeParse(msgJSON);

  if (!parsed.success) {
    console.log(JSON.parse(parsed.error.message));
    return;
  } else {
    switch (parsed.data.event) {
      case "token-create": {
        console.log(parsed.data.data);
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
};
