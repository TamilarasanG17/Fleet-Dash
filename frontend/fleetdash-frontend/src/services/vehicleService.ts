import api from "./api";
import type { Vehicle } from "../types/vehicle";

interface VehicleResponse {
  success: boolean;
  count: number;
  data: Vehicle[];
}

export const getVehicles = async (): Promise<Vehicle[]> => {
  const response = await api.get<VehicleResponse>("/vehicles");
  console.log(response.data);

  return response.data.data;   // ✅ Return only the array
};