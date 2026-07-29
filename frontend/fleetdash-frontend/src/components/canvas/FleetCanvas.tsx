import { useEffect, useRef } from "react";
import useVehicle from "../../hooks/useVehicles";
import useAnimationFrame from "../../hooks/useAnimationFrame";

function FleetCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { vehicles } = useVehicle();

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    canvas.width = 900;
    canvas.height = 500;
  }, []);

//   useAnimationFrame(() => {
//     const canvas = canvasRef.current;

//     if (!canvas) return;

//     const ctx = canvas.getContext("2d");

//     if (!ctx) return;

//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     vehicles.forEach((vehicle) => {
//       const x = vehicle.longitude * 8;
//       const y = vehicle.latitude * 8;

//       ctx.beginPath();
//       ctx.arc(x, y, 8, 0, Math.PI * 2);

//       ctx.fillStyle =
//         vehicle.status === "moving"
//           ? "#16a34a"
//           : vehicle.status === "idle"
//           ? "#eab308"
//           : "#ef4444";

//       ctx.fill();

//       ctx.font = "14px Arial";
//       ctx.fillStyle = "#111827";
//       ctx.fillText(vehicle.vehicleId, x + 12, y);
//     });
//   });

useAnimationFrame(() => {
  const canvas = canvasRef.current;

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  // Clear previous frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ===== Draw Background Grid =====
  for (let x = 0; x < canvas.width; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.strokeStyle = "#e5e7eb";
    ctx.stroke();
  }

  for (let y = 0; y < canvas.height; y += 50) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.strokeStyle = "#e5e7eb";
    ctx.stroke();
  }

  // ===== Draw Vehicles =====
  vehicles.forEach((vehicle) => {
    const x = vehicle.longitude * 8;
    const y = vehicle.latitude * 8;

    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);

    ctx.fillStyle =
      vehicle.status === "moving"
        ? "#16a34a"
        : vehicle.status === "idle"
        ? "#eab308"
        : "#ef4444";

    ctx.fill();

    ctx.font = "14px Arial";
    ctx.fillStyle = "#111827";
    ctx.fillText(vehicle.vehicleId, x + 12, y);
  });
});

  return (
  <div>
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-xl font-bold">
        Fleet Canvas
      </h2>

      <span className="rounded bg-blue-100 px-3 py-1 text-blue-700">
        {vehicles.length} Vehicles
      </span>
    </div>

    <canvas
      ref={canvasRef}
      className="w-full rounded-xl border bg-white shadow"
    />
  </div>
);
}

export default FleetCanvas;