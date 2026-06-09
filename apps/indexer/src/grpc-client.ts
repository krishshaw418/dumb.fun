import Client from "@triton-one/yellowstone-grpc";
import { config } from "./config";

class getClientInstance {
    private static instance: Client;

    static getInstance() {
        if (!this.instance) {
            this.instance = new Client(config.grpcUrl, "", {});
        }
        return this.instance;
    }
}

export const client = getClientInstance.getInstance();