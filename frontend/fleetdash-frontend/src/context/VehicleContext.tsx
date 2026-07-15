import { createContext, useContext, useState } from "react";

import type {
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

import type { Vehicle } from "../types/vehicle";

interface VehicleContextType {
  vehicles: Vehicle[];
  setVehicles: Dispatch<SetStateAction<Vehicle[]>>;

  connected: boolean;
  setConnected: Dispatch<SetStateAction<boolean>>;
}

const VehicleContext = createContext<VehicleContextType | null>(null);

export function VehicleProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [connected, setConnected] = useState(false);

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        setVehicles,
        connected,
        setConnected,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
}

export function useVehicleContext() {
  const context = useContext(VehicleContext);

  if (!context) {
    throw new Error("Vehicle Context Missing");
  }

  return context;
}