import { useEffect, useState } from "react";
import { getVehicles } from "../services/vehicleService";
import { useVehicleContext } from "../context/VehicleContext";

function useVehicles() {
  const {
    vehicles,
    setVehicles,
    setAlerts,
  } = useVehicleContext();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await getVehicles();

        setVehicles(data);

        const latestAlerts = data
          .filter((vehicle) => vehicle.status === "offline")
          .map(
            (vehicle) => `${vehicle.vehicleId} is Offline`
          );

        setAlerts(latestAlerts);
      } catch {
        setError("Failed to load vehicles");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [setVehicles, setAlerts]);

  return {
    vehicles,
    loading,
    error,
  };
}

export default useVehicles;