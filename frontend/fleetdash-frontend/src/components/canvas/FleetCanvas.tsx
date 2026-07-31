import { useEffect, useMemo, useRef } from "react";
import socket from "../../socket/socket";
import type { Vehicle } from "../../types/vehicle";

interface GeofenceAlert {
  vehicleId: string;
}

interface FleetCanvasProps {
  geofenceAlerts: GeofenceAlert[];
}

function FleetCanvas({ geofenceAlerts }: FleetCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vehiclesRef = useRef<Map<string, Vehicle>>(new Map());

  // Vehicles with active geofence alerts
  const highlightedVehicles = useMemo(
    () => new Set(geofenceAlerts.map((alert) => alert.vehicleId)),
    [geofenceAlerts]
  );

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    canvas.width = 900;
    canvas.height = 500;
  }, []);

  useEffect(() => {
    const handleVehicleUpdate = (vehicles: Vehicle[]) => {
      vehicles.forEach((vehicle) => {
        vehiclesRef.current.set(vehicle.vehicleId, vehicle);
      });
    };

    socket.on("vehicle-update", handleVehicleUpdate);

    return () => {
      socket.off("vehicle-update", handleVehicleUpdate);
    };
  }, []);

  useEffect(() => {
    let animationId: number;

    const draw = () => {
      const canvas = canvasRef.current;

      if (!canvas) return;

      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background Grid
      ctx.strokeStyle = "#e5e7eb";

      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw Vehicles
      vehiclesRef.current.forEach((vehicle) => {
        const x = vehicle.longitude * 8;
        const y = vehicle.latitude * 8;

        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);

        ctx.fillStyle = highlightedVehicles.has(vehicle.vehicleId)
          ? "#3b82f6" // Blue for geofence alert
          : vehicle.status === "moving"
          ? "#22c55e" // Green
          : vehicle.status === "idle"
          ? "#eab308" // Yellow
          : "#ef4444"; // Red

        ctx.fill();

        ctx.fillStyle = "#111827";
        ctx.font = "13px Arial";
        ctx.fillText(vehicle.vehicleId, x + 14, y);
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, [highlightedVehicles]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Fleet Canvas</h2>

        <span className="rounded bg-blue-100 px-3 py-1 text-blue-700">
          Live Tracking
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