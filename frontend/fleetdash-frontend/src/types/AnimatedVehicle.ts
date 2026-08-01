export interface AnimatedVehicle {
  vehicleId: string;
  currentX: number;
  currentY: number;
  targetX: number;
  targetY: number;
  status: "moving" | "idle" | "offline";
}