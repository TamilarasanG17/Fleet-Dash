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

  alerts: string[];
  setAlerts: React.Dispatch<React.SetStateAction<string[]>>;
}

const VehicleContext = createContext<VehicleContextType | null>(null);

export function VehicleProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [connected, setConnected] = useState(false);
  const [alerts, setAlerts] = useState<string[]>([]);

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        setVehicles,
        connected,
        setConnected,
        alerts,
        setAlerts,
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