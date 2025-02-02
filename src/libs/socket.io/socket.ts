"use client";

import {io} from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
    ackTimeout: 5000,
    timeout: 5000,
    retries: 3,
});

export default socket;
