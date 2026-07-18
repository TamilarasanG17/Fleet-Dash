import { useEffect } from "react";

import socket from "../socket/socket";
import { useVehicleContext } from "../context/VehicleContext";

import type { Vehicle } from "../types/vehicle";

function useSocket() {
  const {
    setConnected,
    setVehicles,
    setAlerts,
    setLoading,
    setError,
  } = useVehicleContext();

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      setConnected(true);
      setLoading(false);
      setError(null);

      console.log("Connected");
    });

    socket.on("disconnect", () => {
      setConnected(false);

      console.log("Disconnected");
    });

    socket.on("connect_error", () => {
      setError("Unable to connect to server");
      setLoading(false);

      console.log("Connection Error");
    });

    socket.on("vehicle-update", (vehicles: Vehicle[]) => {
      console.log("Vehicle Update:", vehicles);

      setVehicles(vehicles);
      setLoading(false);

      const alerts = vehicles
        .filter(
          (vehicle) =>
            vehicle.speed > 80 ||
            vehicle.status === "offline"
        )
        .map((vehicle) =>
          vehicle.status === "offline"
            ? `${vehicle.vehicleId} Offline`
            : `${vehicle.vehicleId} Overspeed (${vehicle.speed})`
        );

      setAlerts(alerts);
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, []);

  return socket;
}

export default useSocket;