import { useEffect } from "react";

import socket from "../socket/socket";
import { useVehicleContext } from "../context/VehicleContext";

function useSocket() {
  const { setConnected } = useVehicleContext();

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      setConnected(true);
      console.log("Connected");
    });

    socket.on("disconnect", () => {
      setConnected(false);
      console.log("Disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, [setConnected]);

  return socket;
}

export default useSocket;