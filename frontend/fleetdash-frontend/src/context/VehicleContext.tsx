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
  setAlerts: Dispatch<SetStateAction<string[]>>;

  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;

  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        setVehicles,

        connected,
        setConnected,

        alerts,
        setAlerts,

        loading,
        setLoading,

        error,
        setError,
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