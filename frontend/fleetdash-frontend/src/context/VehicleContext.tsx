import {
  createContext,
  useContext,
  useState,
} from "react";

import type { ReactNode, Dispatch, SetStateAction } from "react";
import type { Vehicle } from "../types/vehicle";

interface VehicleContextType {
  vehicles: Vehicle[];
  setVehicles: Dispatch<SetStateAction<Vehicle[]>>;
}

const VehicleContext = createContext<VehicleContextType | null>(null);

export function VehicleProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        setVehicles,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
}

export function useVehicleContext() {
  const context = useContext(VehicleContext);

  if (!context) {
    throw new Error(
      "useVehicleContext must be inside VehicleProvider"
    );
  }

  return context;
}