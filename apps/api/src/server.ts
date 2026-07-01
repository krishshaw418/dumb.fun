import express from "express";
import newTokenRoute from "./routes";
import cors from "cors";
import { WebSocketServer } from "ws";
import http from "node:http";

export const createServers = () => {
    const app = express();
    app.use(cors({
        origin: "*"
    }))
    app.use(express.json());

    app.use("/api", newTokenRoute);

    const server = http.createServer(app);

    const wss = new WebSocketServer({
        host: "localhost",
        autoPong: true,
        server,
        perMessageDeflate: true,
    });

    return { server, wss };
}