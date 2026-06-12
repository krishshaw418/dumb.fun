import express from "express";
import newTokenRoute from "./routes";
import cors from "cors";

export const createServer = () => {
    const app = express();
    app.use(cors({
        origin: "http://127.0.0.1:5173"
    }))
    app.use(express.json());

    app.use("/api", newTokenRoute);

    return app;
}