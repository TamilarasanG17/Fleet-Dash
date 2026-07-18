import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  autoConnect: false,

  transports: ["websocket"],

  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,

  timeout: 5000,
});

export default socket;