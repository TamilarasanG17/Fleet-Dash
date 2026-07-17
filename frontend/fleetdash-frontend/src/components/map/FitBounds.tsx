import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

interface TelemetryPoint {
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  timestamp: string;
}

interface TelemetryVehicle {
  vehicleId: string;
  telemetry: TelemetryPoint[];
}

interface FitBoundsProps {
  telemetry: TelemetryVehicle[];
}

function FitBounds({ telemetry }: FitBoundsProps) {
  const map = useMap();

  useEffect(() => {
    if (telemetry.length === 0) return;

    const bounds = L.latLngBounds(
      telemetry.map((vehicle) => {
        const latest =
          vehicle.telemetry[vehicle.telemetry.length - 1];

        return [latest.latitude, latest.longitude] as [
          number,
          number
        ];
      })
    );

    map.fitBounds(bounds, {
      padding: [50, 50],
    });
  }, [telemetry, map]);

  return null;
}

export default FitBounds;