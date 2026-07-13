import { useEffect, useState } from "react";
import { getVehicles } from "../services/vehicleService";
import { useVehicleContext } from "../context/VehicleContext";

function useVehicles() {
  const { vehicles, setVehicles } = useVehicleContext();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await getVehicles();
        setVehicles(data);
      } catch {
        setError("Failed to load vehicles");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [setVehicles]);

  return {
    vehicles,
    loading,
    error,
  };
}

export default useVehicles;