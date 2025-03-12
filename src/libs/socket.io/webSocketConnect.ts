import {WebSocketTransport} from "@/helpers/shared/types";
import socket from "./socket";

const TIMEOUT = 10000; // 10 seconds

export const webSocketConnect = async (transport?: WebSocketTransport): Promise<boolean> => {
    if (socket.connected) {
        return transport === "websocket" || (await handleUpgrade());
    }

    try {
        await new Promise<void>((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error("Connection timeout")), TIMEOUT);

            socket.on("connect", () => {
                clearTimeout(timer);
                resolve();
            });

            socket.on("connect_error", (err) => {
                clearTimeout(timer);
                reject(err);
            });

            socket.connect();
        });

        return transport === "websocket" || (await handleUpgrade());
    } catch (err) {
        console.error("🚀 ~ webSocketConnect error:", err);
        return false;
    }
};

const handleUpgrade = async (): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
        socket.io.engine.on("upgrade", (upgradedTransport) => {
            resolve(upgradedTransport.name === "websocket");
        });
    });
};
