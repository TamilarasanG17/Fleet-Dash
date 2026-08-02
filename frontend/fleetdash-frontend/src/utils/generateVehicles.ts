import type{ Vehicle } from "../types/vehicle";

export function generateVehicles(count: number): Vehicle[] {

  const vehicles: Vehicle[] = [];

  for (let i = 1; i <= count; i++) {

    vehicles.push({

      _id: String(i),

      vehicleId: `TRUCK${i}`,

      latitude: Math.random() * 450,

      longitude: Math.random() * 850,

      speed: Math.floor(Math.random() * 120),

      status: ["moving","idle","offline"][
        Math.floor(Math.random()*3)
      ] as "moving" | "idle" | "offline"

    });

  }

  return vehicles;

}