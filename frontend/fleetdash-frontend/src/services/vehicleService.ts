import api from "./api";
import type { Vehicle } from "../types/vehicle";

interface VehicleResponse {
  success: boolean;
  count: number;
  data: Vehicle[];
}

export const getVehicles = async (): Promise<Vehicle[]> => {
  try {
    const response = await api.get("/vehicles");
    return response.data.data;
  } catch (error) {
    console.error("Vehicle API Error:", error);
    throw error;
  }
};