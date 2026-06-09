import Client from "@triton-one/yellowstone-grpc";
import { config } from "./config";

class GetClientInstance {
    private static instance: Client;

    static getInstance(): Client {
        if (!this.instance) {
            this.instance = new Client(config.grpcUrl, "", {});
        }
        return this.instance;
    }
}

export const client = GetClientInstance.getInstance();