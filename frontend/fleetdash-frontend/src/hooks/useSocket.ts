import { useEffect } from "react";

import socket from "../socket/socket";
import { useVehicleContext } from "../context/VehicleContext";

import type { Vehicle } from "../types/vehicle";

function useSocket() {
  const {
    setConnected,
    setVehicles,
  } = useVehicleContext();

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

    socket.on("vehicle-update", (data: Vehicle[]) => {
      console.log("Vehicle Update:", data);
      setVehicles(data);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("vehicle-update");

      socket.disconnect();
    };
  }, [setConnected, setVehicles]);

  return socket;
}

export default useSocket;