import {WebSocketTransport} from "@/helpers/shared/types";
import socket from "./socket";

export const webSocketConnect = async (transport?: WebSocketTransport): Promise<boolean> => {
    try {
        if (!socket.connected) {
            // Thực hiện kết nối
            socket.connect();

            // Chờ kết nối thành công
            await new Promise<void>((resolve, reject) => {
                const timer = setTimeout(() => {
                    reject(new Error("Kết nối thất bại sau 5 giây."));
                }, 5000); // Timeout sau 5 giây

                socket.on("connect", () => {
                    clearTimeout(timer);
                    resolve();
                });

                socket.on("connect_error", (err) => {
                    clearTimeout(timer);
                    reject(err);
                });
            });
        }

        // Logic kiểm tra và xử lý sau khi đã kết nối
        if (socket.connected) {
            let timerId: NodeJS.Timeout | null = null;

            timerId = setTimeout(() => {
                return transport === "websocket";
            }, 5000);

            socket.io.engine.on("upgrade", (upgradedTransport) => {
                if (timerId) clearTimeout(timerId);
                return webSocketConnect(upgradedTransport.name as WebSocketTransport);
            });

            return true; // Trả về true nếu kết nối thành công
        }

        return false; // Trả về false nếu không thể kết nối
    } catch (err) {
        console.log("🚀 ~ webSocketConnect ~ err:", err);
        return false;
    }
};
