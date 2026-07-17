export interface Vehicle {

    _id:string;

    vehicleId:string;

    vehicleNumber?: string;
  driverName?: string;
  vehicleType?: string;

    latitude:number;

    longitude:number;

    speed:number;

    status: "moving" | "idle" | "offline";

}