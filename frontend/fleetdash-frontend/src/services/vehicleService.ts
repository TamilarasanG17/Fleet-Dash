import api from "./api";
import type{ Vehicle } from "../types/vehicle";

export const getVehicles = async (): Promise<Vehicle[]> => {
  const response = await api.get("/vehicles");
  return response.data;
};