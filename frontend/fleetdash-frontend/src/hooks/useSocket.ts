import { useEffect } from "react";

import socket from "../socket/socket";
import { useVehicleContext } from "../context/VehicleContext";

import type { Vehicle } from "../types/vehicle";

function useSocket() {
  const {
    setConnected,
    setVehicles,
    setAlerts,
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

    socket.on("vehicle-update", (vehicles: Vehicle[]) => {
      console.log("Vehicle Update:", vehicles);

      setVehicles(vehicles);

      const latestAlerts = vehicles
        .filter(
          (vehicle) =>
            vehicle.speed > 80 ||
            vehicle.status === "offline"
        )
        .map((vehicle) => {
          if (vehicle.status === "offline") {
            return `${vehicle.vehicleId} is Offline`;
          }

          return `${vehicle.vehicleId} Overspeed (${vehicle.speed} km/h)`;
        });

      setAlerts(latestAlerts);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("vehicle-update");

      socket.disconnect();
    };
  }, [setConnected, setVehicles, setAlerts]);

  return socket;
}

export default useSocket;