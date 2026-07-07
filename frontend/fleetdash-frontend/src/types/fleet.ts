export type VehicleStatus = "moving" | "idle" | "offline";

export interface VehiclePosition {
  readonly vehicleId: string;
  readonly label: string;
  readonly lat: number;
  readonly lng: number;
  readonly speedKph: number;
  readonly status: VehicleStatus;
  readonly lastUpdatedIso: string;
}

export interface GeofenceZone {
  readonly zoneId: string;
  readonly name: string;
  readonly centerLat: number;
  readonly centerLng: number;
  readonly radiusMeters: number;
}

export type AlertSeverity = "info" | "warning" | "critical";

export interface FleetAlert {
  readonly alertId: string;
  readonly message: string;
  readonly severity: AlertSeverity;
  readonly timestampIso: string;
}

export interface FleetSummaryStats {
  readonly activeVehicles: number;
  readonly totalVehicles: number;
  readonly alertsToday: number;
  readonly avgSpeedKph: number;
  readonly geofenceBreaches: number;
}

export type ConnectionState = "online" | "connecting" | "offline";
