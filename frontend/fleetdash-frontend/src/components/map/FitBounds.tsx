// import { useEffect } from "react";
// import { useMap } from "react-leaflet";
// import L from "leaflet";

// interface TelemetryPoint {
//   latitude: number;
//   longitude: number;
//   speed: number;
//   heading: number;
//   timestamp: string;
// }

// interface TelemetryVehicle {
//   vehicleId: string;
//   telemetry: TelemetryPoint[];
// }

// interface FitBoundsProps {
//   telemetry: TelemetryVehicle[];
// }

// function FitBounds({ telemetry }: FitBoundsProps) {
//   const map = useMap();

//   useEffect(() => {
//     if (telemetry.length === 0) return;

//     const bounds = L.latLngBounds(
//       telemetry.map((vehicle) => {
//         const latest =
//           vehicle.telemetry[vehicle.telemetry.length - 1];

//         return [latest.latitude, latest.longitude] as [
//           number,
//           number
//         ];
//       })
//     );

//     map.fitBounds(bounds, {
//       padding: [50, 50],
//     });
//   }, [telemetry, map]);

//   return null;
// }

// export default FitBounds;

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

import type { Vehicle } from "../../types/vehicle";

interface Props {
  vehicles: Vehicle[];
}

function FitBounds({ vehicles }: Props) {
  const map = useMap();

  useEffect(() => {
    const validVehicles = vehicles.filter(
      (vehicle) =>
        vehicle.latitude !== 0 &&
        vehicle.longitude !== 0
    );

    if (validVehicles.length === 0) return;

    const bounds = L.latLngBounds(
      validVehicles.map((vehicle) => [
        vehicle.latitude,
        vehicle.longitude,
      ])
    );

    map.fitBounds(bounds, {
      padding: [40, 40],
    });
  }, [vehicles, map]);

  return null;
}

export default FitBounds;