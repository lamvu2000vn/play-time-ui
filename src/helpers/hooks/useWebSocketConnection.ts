import socket from "@/libs/socket.io/socket";
import {useEffect, useState} from "react";
import {WebSocketTransport} from "../shared/types";

export default function useWebSocketConnection() {
    const [transport, setTransport] = useState<WebSocketTransport>("N/A");

    useEffect(() => {
        if (socket.connected) {
            onConnect();
        }

        function onConnect() {
            setTransport(socket.io.engine.transport.name as WebSocketTransport);

            socket.io.engine.on("upgrade", (transport) => {
                setTransport(transport.name as WebSocketTransport);
            });
        }

        function onDisconnect() {
            setTransport("N/A");
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
        };
    }, []);

    return transport;
}
