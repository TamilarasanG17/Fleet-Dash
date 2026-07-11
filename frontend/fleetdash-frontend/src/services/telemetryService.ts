import api from "./api";

export interface TelemetryPoint {
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  timestamp: string;
}

export interface VehicleTelemetry {
  vehicleId: string;
  bucketStartTime: string;
  telemetry: TelemetryPoint[];
}

interface TelemetryResponse {
  success: boolean;
  count: number;
  data: VehicleTelemetry[];
}

export const getTelemetry = async (): Promise<VehicleTelemetry[]> => {
  const response = await api.get<TelemetryResponse>("/telemetry");
  return response.data.data;
};