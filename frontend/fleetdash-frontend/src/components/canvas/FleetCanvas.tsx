import { useEffect, useMemo, useRef } from "react";
import socket from "../../socket/socket";
import type { Vehicle } from "../../types/vehicle";

interface GeofenceAlert {
  vehicleId: string;
}

interface FleetCanvasProps {
  geofenceAlerts: GeofenceAlert[];
}

interface AnimatedVehicle {
  vehicleId: string;
  currentX: number;
  currentY: number;
  targetX: number;
  targetY: number;
  status: string;
}

function FleetCanvas({ geofenceAlerts }: FleetCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const animatedVehicles = useRef<Map<string, AnimatedVehicle>>(new Map());

  const zoomRef = useRef(1);

  const fpsRef = useRef(0);
  const lastTime = useRef(performance.now());

  const highlightedVehicles = useMemo(
    () => new Set(geofenceAlerts.map((alert) => alert.vehicleId)),
    [geofenceAlerts]
  );

  // Auto Resize Canvas
  useEffect(() => {
    const resize = () => {
      if (!canvasRef.current) return;

      canvasRef.current.width =
        canvasRef.current.parentElement?.clientWidth ?? 900;

      canvasRef.current.height = 500;
    };

    resize();

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Zoom
  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      if (event.deltaY < 0) {
        zoomRef.current *= 1.1;
      } else {
        zoomRef.current /= 1.1;
      }

      zoomRef.current = Math.max(
        0.5,
        Math.min(zoomRef.current, 3)
      );
    };

    canvas.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // Receive Vehicle Updates
  useEffect(() => {
    const handleVehicleUpdate = (vehicles: Vehicle[]) => {
      vehicles.forEach((vehicle) => {
        const x = vehicle.longitude * 8;
        const y = vehicle.latitude * 8;

        const existing = animatedVehicles.current.get(
          vehicle.vehicleId
        );

        if (existing) {
          existing.targetX = x;
          existing.targetY = y;
          existing.status = vehicle.status;
        } else {
          animatedVehicles.current.set(vehicle.vehicleId, {
            vehicleId: vehicle.vehicleId,
            currentX: x,
            currentY: y,
            targetX: x,
            targetY: y,
            status: vehicle.status,
          });
        }
      });
    };
    const handleVehicleRemove = (vehicleId: string) => {
    animatedVehicles.current.delete(vehicleId);
  };

    socket.on("vehicle-update", handleVehicleUpdate);
     socket.on("vehicle-remove", handleVehicleRemove);

    return () => {
      socket.off("vehicle-update", handleVehicleUpdate);
      socket.off("vehicle-remove", handleVehicleRemove);
    };
  }, []);

  const drawVehicle = (
    ctx: CanvasRenderingContext2D,
    vehicle: AnimatedVehicle
  ) => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    // Smooth Animation
    vehicle.currentX +=
      (vehicle.targetX - vehicle.currentX) * 0.08;

    vehicle.currentY +=
      (vehicle.targetY - vehicle.currentY) * 0.08;

    // Skip Invisible Vehicles
    if (
      vehicle.currentX < 0 ||
      vehicle.currentX > canvas.width ||
      vehicle.currentY < 0 ||
      vehicle.currentY > canvas.height
    ) {
      return;
    }

    const markerColor: Record<string, string> = {
      Running: "#16a34a",
      Idle: "#f59e0b",
      Offline: "#ef4444",
      moving: "#16a34a",
      idle: "#f59e0b",
      offline: "#ef4444",
    };

    // Vehicle Marker
    ctx.beginPath();
    ctx.arc(
      vehicle.currentX,
      vehicle.currentY,
      9,
      0,
      Math.PI * 2
    );

    ctx.fillStyle = highlightedVehicles.has(vehicle.vehicleId)
      ? "#2563eb"
      : markerColor[vehicle.status] ?? "#6b7280";

    ctx.fill();

    // Border
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Direction Indicator
    ctx.beginPath();
    ctx.moveTo(vehicle.currentX, vehicle.currentY);
    ctx.lineTo(vehicle.currentX + 15, vehicle.currentY);
    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Vehicle ID
    ctx.fillStyle = "#111827";
    ctx.font = "13px Arial";
    ctx.fillText(
      vehicle.vehicleId,
      vehicle.currentX + 14,
      vehicle.currentY
    );
  };

  // Animation Loop
  useEffect(() => {
    let animationId: number;

    const draw = () => {
      const canvas = canvasRef.current;

      if (!canvas) return;

      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      // FPS
      const now = performance.now();

      fpsRef.current = Math.round(
        1000 / (now - lastTime.current)
      );

      lastTime.current = now;

      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      ctx.save();

      ctx.scale(
        zoomRef.current,
        zoomRef.current
      );

      // Background Grid
      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 1;

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
      animatedVehicles.current.forEach((vehicle) => {
        drawVehicle(ctx, vehicle);
      });

      ctx.restore();

      // FPS Counter
      ctx.fillStyle = "#111827";
      ctx.font = "16px Arial";
      ctx.fillText(
        `FPS : ${fpsRef.current}`,
        20,
        25
      );

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, [highlightedVehicles]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">
          Fleet Canvas
        </h2>

        <span className="rounded bg-blue-100 px-3 py-1 text-blue-700">
          Live Tracking
        </span>
      </div>

      <canvas
        ref={canvasRef}
        className="w-full rounded-xl border bg-white shadow"
      />
      <div className="mt-3 flex flex-wrap gap-6 text-sm font-medium">
      <span className="text-green-600">
        🟢 Running
      </span>

      <span className="text-yellow-500">
        🟡 Idle
      </span>

      <span className="text-red-600">
        🔴 Offline
      </span>

      <span className="text-blue-600">
        🔵 Geofence Alert
      </span>
    </div>
    </div>
  );
}

export default FleetCanvas;

// import { useEffect, useMemo, useRef } from "react";
// import socket from "../../socket/socket";
// import type { Vehicle } from "../../types/vehicle";

// interface GeofenceAlert {
//   vehicleId: string;
// }

// interface FleetCanvasProps {
//   geofenceAlerts: GeofenceAlert[];
// }

// interface AnimatedVehicle {
//   vehicleId: string;
//   currentX: number;
//   currentY: number;
//   targetX: number;
//   targetY: number;
//   status: string;
// }

// function FleetCanvas({ geofenceAlerts }: FleetCanvasProps) {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   // Smooth animation cache
//   const animatedVehicles = useRef<Map<string, AnimatedVehicle>>(new Map());

//   // Zoom
//   const zoomRef = useRef(1);

//   // FPS
//   const fpsRef = useRef(0);
//   const lastTime = useRef(performance.now());

//   // Geofence highlight
//   const highlightedVehicles = useMemo(
//     () => new Set(geofenceAlerts.map((alert) => alert.vehicleId)),
//     [geofenceAlerts]
//   );

//   useEffect(() => {
//     const canvas = canvasRef.current;

//     if (!canvas) return;

//     canvas.width = 900;
//     canvas.height = 500;

//     const handleWheel = (event: WheelEvent) => {
//       event.preventDefault();

//       if (event.deltaY < 0) {
//         zoomRef.current *= 1.1;
//       } else {
//         zoomRef.current /= 1.1;
//       }

//       zoomRef.current = Math.max(
//         0.5,
//         Math.min(zoomRef.current, 3)
//       );
//     };

//     canvas.addEventListener("wheel", handleWheel, {
//       passive: false,
//     });

//     return () => {
//       canvas.removeEventListener("wheel", handleWheel);
//     };
//   }, []);

//   useEffect(() => {
//     const handleVehicleUpdate = (vehicles: Vehicle[]) => {
//       vehicles.forEach((vehicle) => {
//         const x = vehicle.longitude * 8;
//         const y = vehicle.latitude * 8;

//         const existing = animatedVehicles.current.get(vehicle.vehicleId);

//         if (existing) {
//           existing.targetX = x;
//           existing.targetY = y;
//           existing.status = vehicle.status;
//         } else {
//           animatedVehicles.current.set(vehicle.vehicleId, {
//             vehicleId: vehicle.vehicleId,
//             currentX: x,
//             currentY: y,
//             targetX: x,
//             targetY: y,
//             status: vehicle.status,
//           });
//         }
//       });
//     };

//     socket.on("vehicle-update", handleVehicleUpdate);

//     return () => {
//       socket.off("vehicle-update", handleVehicleUpdate);
//     };
//   }, []);

//   useEffect(() => {
//     let animationId: number;

//     const markerColor: Record<string, string> = {
//       Running: "#16a34a",
//       Idle: "#f59e0b",
//       Offline: "#ef4444",

//       // Optional lowercase support
//       moving: "#16a34a",
//       idle: "#f59e0b",
//       offline: "#ef4444",
//     };

//     const draw = () => {
//       const canvas = canvasRef.current;

//       if (!canvas) return;

//       const ctx = canvas.getContext("2d");

//       if (!ctx) return;

//       // FPS
//       const now = performance.now();
//       fpsRef.current = Math.round(
//         1000 / (now - lastTime.current)
//       );
//       lastTime.current = now;

//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       // Apply Zoom
//       ctx.save();
//       ctx.scale(zoomRef.current, zoomRef.current);

//       // Background Grid
//       ctx.strokeStyle = "#e5e7eb";
//       ctx.lineWidth = 1;

//       for (let x = 0; x < canvas.width; x += 50) {
//         ctx.beginPath();
//         ctx.moveTo(x, 0);
//         ctx.lineTo(x, canvas.height);
//         ctx.stroke();
//       }

//       for (let y = 0; y < canvas.height; y += 50) {
//         ctx.beginPath();
//         ctx.moveTo(0, y);
//         ctx.lineTo(canvas.width, y);
//         ctx.stroke();
//       }

//       // Draw Vehicles
//       animatedVehicles.current.forEach((vehicle) => {
//         // Smooth movement
//         vehicle.currentX +=
//           (vehicle.targetX - vehicle.currentX) * 0.08;

//         vehicle.currentY +=
//           (vehicle.targetY - vehicle.currentY) * 0.08;

//         // Skip vehicles outside visible area
//         if (
//           vehicle.currentX < 0 ||
//           vehicle.currentX > canvas.width ||
//           vehicle.currentY < 0 ||
//           vehicle.currentY > canvas.height
//         ) {
//           return;
//         }

//         // Marker
//         ctx.beginPath();
//         ctx.arc(
//           vehicle.currentX,
//           vehicle.currentY,
//           9,
//           0,
//           Math.PI * 2
//         );

//         ctx.fillStyle = highlightedVehicles.has(vehicle.vehicleId)
//           ? "#2563eb"
//           : markerColor[vehicle.status] ?? "#6b7280";

//         ctx.fill();

//         // White Border
//         ctx.strokeStyle = "#ffffff";
//         ctx.lineWidth = 2;
//         ctx.stroke();

//         // Direction Indicator
//         ctx.beginPath();
//         ctx.moveTo(
//           vehicle.currentX,
//           vehicle.currentY
//         );

//         ctx.lineTo(
//           vehicle.currentX + 15,
//           vehicle.currentY
//         );

//         ctx.strokeStyle = "#2563eb";
//         ctx.lineWidth = 2;
//         ctx.stroke();

//         // Vehicle ID
//         ctx.fillStyle = "#111827";
//         ctx.font = "13px Arial";
//         ctx.fillText(
//           vehicle.vehicleId,
//           vehicle.currentX + 14,
//           vehicle.currentY
//         );
//       });

//       // Restore canvas after zoom
//       ctx.restore();

//       // FPS Counter
//       ctx.fillStyle = "#111827";
//       ctx.font = "16px Arial";
//       ctx.fillText(
//         `FPS : ${fpsRef.current}`,
//         20,
//         25
//       );

//       animationId = requestAnimationFrame(draw);
//     };

//     draw();

//     return () => cancelAnimationFrame(animationId);
//   }, [highlightedVehicles]);

//   return (
//     <div>
//       <div className="mb-4 flex items-center justify-between">
//         <h2 className="text-xl font-bold">
//           Fleet Canvas
//         </h2>

//         <span className="rounded bg-blue-100 px-3 py-1 text-blue-700">
//           Live Tracking
//         </span>
//       </div>

//       <canvas
//         ref={canvasRef}
//         className="w-full rounded-xl border bg-white shadow"
//       />
//     </div>
//   );
// }

// export default FleetCanvas;

// import { useEffect, useMemo, useRef } from "react";
// import socket from "../../socket/socket";
// import type { Vehicle } from "../../types/vehicle";

// interface GeofenceAlert {
//   vehicleId: string;
// }

// interface FleetCanvasProps {
//   geofenceAlerts: GeofenceAlert[];
// }

// function FleetCanvas({ geofenceAlerts }: FleetCanvasProps) {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const vehiclesRef = useRef<Map<string, Vehicle>>(new Map());

//   // Vehicles with active geofence alerts
//   const highlightedVehicles = useMemo(
//     () => new Set(geofenceAlerts.map((alert) => alert.vehicleId)),
//     [geofenceAlerts]
//   );

//   useEffect(() => {
//     const canvas = canvasRef.current;

//     if (!canvas) return;

//     canvas.width = 900;
//     canvas.height = 500;
//   }, []);

//   useEffect(() => {
//     const handleVehicleUpdate = (vehicles: Vehicle[]) => {
//       vehicles.forEach((vehicle) => {
//         vehiclesRef.current.set(vehicle.vehicleId, vehicle);
//       });
//     };

//     socket.on("vehicle-update", handleVehicleUpdate);

//     return () => {
//       socket.off("vehicle-update", handleVehicleUpdate);
//     };
//   }, []);

//   useEffect(() => {
//     let animationId: number;

//     const draw = () => {
//       const canvas = canvasRef.current;

//       if (!canvas) return;

//       const ctx = canvas.getContext("2d");

//       if (!ctx) return;

//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       // Background Grid
//       ctx.strokeStyle = "#e5e7eb";

//       for (let x = 0; x < canvas.width; x += 50) {
//         ctx.beginPath();
//         ctx.moveTo(x, 0);
//         ctx.lineTo(x, canvas.height);
//         ctx.stroke();
//       }

//       for (let y = 0; y < canvas.height; y += 50) {
//         ctx.beginPath();
//         ctx.moveTo(0, y);
//         ctx.lineTo(canvas.width, y);
//         ctx.stroke();
//       }

//       // Draw Vehicles
//       vehiclesRef.current.forEach((vehicle) => {
//         const x = vehicle.longitude * 8;
//         const y = vehicle.latitude * 8;

//         ctx.beginPath();
//         ctx.arc(x, y, 10, 0, Math.PI * 2);

//         ctx.fillStyle = highlightedVehicles.has(vehicle.vehicleId)
//           ? "#3b82f6" // Blue for geofence alert
//           : vehicle.status === "moving"
//           ? "#22c55e" // Green
//           : vehicle.status === "idle"
//           ? "#eab308" // Yellow
//           : "#ef4444"; // Red

//         ctx.fill();

//         ctx.fillStyle = "#111827";
//         ctx.font = "13px Arial";
//         ctx.fillText(vehicle.vehicleId, x + 14, y);
//       });

//       animationId = requestAnimationFrame(draw);
//     };

//     draw();

//     return () => cancelAnimationFrame(animationId);
//   }, [highlightedVehicles]);

//   return (
//     <div>
//       <div className="mb-4 flex items-center justify-between">
//         <h2 className="text-xl font-bold">Fleet Canvas</h2>

//         <span className="rounded bg-blue-100 px-3 py-1 text-blue-700">
//           Live Tracking
//         </span>
//       </div>

//       <canvas
//         ref={canvasRef}
//         className="w-full rounded-xl border bg-white shadow"
//       />
//     </div>
//   );
// }

// export default FleetCanvas;