import { useEffect, useState } from "react";
import { getTelemetry, type VehicleTelemetry } from "../services/telemetryService";

export default function useTelemetry() {
  const [telemetry, setTelemetry] = useState<VehicleTelemetry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getTelemetry()
      .then(setTelemetry)
      .catch(() => setError("Failed to load telemetry"))
      .finally(() => setLoading(false));
  }, []);

  return { telemetry, loading, error };
}