import { useRef } from "react";
import type{ Vehicle } from "../types/vehicle";

function useVehicleCache() {
  const vehicleCache = useRef<Map<string, Vehicle>>(new Map());

  return vehicleCache;
}

export default useVehicleCache;