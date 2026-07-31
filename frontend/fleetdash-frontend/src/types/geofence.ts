export interface GeofenceAlert {
  id: string;
  vehicleId: string;
  type: "ENTER" | "EXIT";
  zoneName: string;
  timestamp: string;
}