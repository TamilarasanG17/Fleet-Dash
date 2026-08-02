import type{ AnimatedVehicle } from "../types/AnimatedVehicle";

export function drawVehicle(

  ctx: CanvasRenderingContext2D,

  vehicle: AnimatedVehicle

) {

  const colors = {

    moving:"#16a34a",

    idle:"#f59e0b",

    offline:"#ef4444"

  };

  ctx.beginPath();

  ctx.arc(

    vehicle.currentX,

    vehicle.currentY,

    8,

    0,

    Math.PI*2

  );

  ctx.fillStyle = colors[vehicle.status];

  ctx.fill();

  ctx.fillStyle="#111827";

  ctx.font="12px Arial";

  ctx.fillText(

    vehicle.vehicleId,

    vehicle.currentX+10,

    vehicle.currentY

  );

}