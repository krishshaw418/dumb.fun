import express from "express";
import newTokenRoute from "./routes";

export const createServer = () => {
    const app = express();
    app.use(express.json());

    app.use("/api", newTokenRoute);

    return app;
}