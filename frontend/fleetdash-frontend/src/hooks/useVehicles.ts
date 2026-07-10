import { useEffect, useState } from "react";
import type{ Vehicle } from "../types/vehicle";
import { getVehicles } from "../services/vehicleService";

function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
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
  }, []);

  return {
    vehicles,
    loading,
    error,
  };
}

export default useVehicles;