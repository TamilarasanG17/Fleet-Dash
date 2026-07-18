export interface Vehicle {
  _id: string;

  vehicleId: string;
  vehicleNumber?: string;
  driverName?: string;
  vehicleType?: string;

  latitude: number;
  longitude: number;
  speed: number;
  heading?: number;
  timestamp?: string;

  status: "moving" | "idle" | "offline";
}