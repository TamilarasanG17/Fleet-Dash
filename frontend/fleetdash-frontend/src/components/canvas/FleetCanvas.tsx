import { useEffect, useMemo, useRef } from "react";

import { useVehicleContext } from "../../context/VehicleContext";


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
  // Decluttered on-screen position: eases toward currentX/currentY but gets
  // gently nudged apart when vehicles are close together, so markers don't
  // stack on top of each other.
  renderX: number;
  renderY: number;
  status: string;
}

interface LabelBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

function FleetCanvas({ geofenceAlerts }: FleetCanvasProps) {
  const { vehicles } = useVehicleContext();
  console.log("Vehicles:", vehicles);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const animatedVehicles = useRef<Map<string, AnimatedVehicle>>(new Map());

  const zoomRef = useRef(1);

  const fpsRef = useRef(0);
  const lastTime = useRef(performance.now());

//   const greenTruck = useRef(new Image());
// const yellowTruck = useRef(new Image());
// const redTruck = useRef(new Image());
// const blueTruck = useRef(new Image());

// useEffect(() => {
//   greenTruck.current.src = truckGreen;
//   yellowTruck.current.src = truckYellow;
//   redTruck.current.src = truckRed;
//   blueTruck.current.src = truckBlue;
// }, []);

  const highlightedVehicles = useMemo(
    () => new Set(geofenceAlerts.map((alert) => alert.vehicleId)),
    [geofenceAlerts]
  );

  const projectCoordinates = (
  latitude: number,
  longitude: number
) => {
  const canvas = canvasRef.current;

  if (!canvas) {
    return { x: 0, y: 0 };
  }

  // India GPS Bounds
  const MIN_LAT = 8;
  const MAX_LAT = 38;

  const MIN_LNG = 68;
  const MAX_LNG = 98;

  const padding = 30;

  const x =
    ((longitude - MIN_LNG) /
      (MAX_LNG - MIN_LNG)) *
      (canvas.width - padding * 2) +
    padding;

  const y =
    canvas.height -
    (((latitude - MIN_LAT) /
      (MAX_LAT - MIN_LAT)) *
      (canvas.height - padding * 2) +
      padding);

  return { x, y };
};

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


useEffect(() => {
  vehicles.forEach((vehicle) => {
    // const x = vehicle.longitude * 8;
    // const y = vehicle.latitude * 8;
    const { x, y } = projectCoordinates(
  vehicle.latitude,
  vehicle.longitude
);

    const existing = animatedVehicles.current.get(vehicle.vehicleId);

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
        renderX: x,
        renderY: y,
        status: vehicle.status,
      });
    }
  });

  const ids = new Set(vehicles.map((v) => v.vehicleId));

  animatedVehicles.current.forEach((_, id) => {
    if (!ids.has(id)) {
      animatedVehicles.current.delete(id);
    }
  });
}, [vehicles]);

  // Status color theme used across markers, glows and rings
  const statusTheme: Record<string, { color: string; glow: string }> = {
    Running: { color: "#10b981", glow: "rgba(16, 185, 129, 0.4)" },
    moving: { color: "#10b981", glow: "rgba(16, 185, 129, 0.4)" },
    Idle: { color: "#f59e0b", glow: "rgba(245, 158, 11, 0.4)" },
    idle: { color: "#f59e0b", glow: "rgba(245, 158, 11, 0.4)" },
    Offline: { color: "#ef4444", glow: "rgba(239, 68, 68, 0.35)" },
    offline: { color: "#ef4444", glow: "rgba(239, 68, 68, 0.35)" },
  };

  // When two or more vehicles are geographically close, their markers would
  // otherwise sit on top of each other. This nudges a copy of their positions
  // apart until every pair is at least minSeparation px away from each other,
  // without touching the real coordinates used for animation targets.
  const MIN_MARKER_SEPARATION = 34;

  const resolveMarkerOverlaps = (
    positions: { id: string; x: number; y: number }[]
  ) => {
    const iterations = 6;

    for (let iter = 0; iter < iterations; iter++) {
      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          const a = positions[i];
          const b = positions[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.max(Math.hypot(dx, dy), 0.01);

          if (dist < MIN_MARKER_SEPARATION) {
            const push = (MIN_MARKER_SEPARATION - dist) / 2;
            const nx = dx / dist;
            const ny = dy / dist;

            a.x -= nx * push;
            a.y -= ny * push;
            b.x += nx * push;
            b.y += ny * push;
          }
        }
      }
    }

    return positions;
  };

  const drawVehicle = (
    ctx: CanvasRenderingContext2D,
    vehicle: AnimatedVehicle,
    placedLabels: LabelBox[],
    now: number
  ) => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    // Displayed marker position (decluttered, eased) vs. true geographic position
    const x = vehicle.renderX;
    const y = vehicle.renderY;
    const trueX = vehicle.currentX;
    const trueY = vehicle.currentY;

    // Skip Invisible Vehicles
    if (
      x < -20 ||
      x > canvas.width + 20 ||
      y < -20 ||
      y > canvas.height + 20
    ) {
      return;
    }

    const isAlert = highlightedVehicles.has(vehicle.vehicleId);
    const theme =
      statusTheme[vehicle.status] ?? {
        color: "#6b7280",
        glow: "rgba(107, 114, 128, 0.3)",
      };

    // If this marker was nudged away from its true position to avoid
    // overlapping a nearby vehicle, show a faint leader line back to it.
    const nudgedDistance = Math.hypot(x - trueX, y - trueY);

    if (nudgedDistance > 2) {
      ctx.beginPath();
      ctx.moveTo(trueX, trueY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = "rgba(100, 116, 139, 0.4)";
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.arc(trueX, trueY, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(100, 116, 139, 0.55)";
      ctx.fill();
    }

    // Pulsing radar rings for geofence alerts
    if (isAlert) {
      for (let i = 0; i < 2; i++) {
        const phase = ((now / 900 + i * 0.5) % 1);
        const radius = 14 + phase * 20;
        const alpha = 0.55 * (1 - phase);

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // Soft glow halo behind the marker
    const halo = ctx.createRadialGradient(x, y, 0, x, y, 22);
    halo.addColorStop(0, isAlert ? "rgba(37, 99, 235, 0.35)" : theme.glow);
    halo.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    // Marker plate
    ctx.beginPath();
    ctx.arc(x, y, 13, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = isAlert ? "#2563eb" : theme.color;
    ctx.stroke();

    // Vehicle Marker (truck glyph)
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🚚", x, y + 1);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    // Status dot
    ctx.beginPath();
    ctx.arc(x + 10, y - 9, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = isAlert ? "#2563eb" : theme.color;
    ctx.fill();
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();

    // Vehicle ID label, drawn as a rounded chip with simple
    // collision avoidance so nearby vehicles don't overlap.
    ctx.font = "600 11px Arial";
    const textWidth = ctx.measureText(vehicle.vehicleId).width;
    const paddingX = 6;
    const chipWidth = textWidth + paddingX * 2;
    const chipHeight = 16;

    let labelX = x + 16;
    let labelY = y - chipHeight / 2;

    let attempts = 0;
    while (attempts < 8) {
      const collides = placedLabels.some(
        (label) =>
          labelX < label.x + label.width &&
          labelX + chipWidth > label.x &&
          labelY < label.y + label.height &&
          labelY + chipHeight > label.y
      );

      if (!collides) break;

      labelY += chipHeight + 3;
      attempts += 1;
    }

    placedLabels.push({ x: labelX, y: labelY, width: chipWidth, height: chipHeight });

    const radius = 5;
    ctx.beginPath();
    ctx.moveTo(labelX + radius, labelY);
    ctx.arcTo(labelX + chipWidth, labelY, labelX + chipWidth, labelY + chipHeight, radius);
    ctx.arcTo(labelX + chipWidth, labelY + chipHeight, labelX, labelY + chipHeight, radius);
    ctx.arcTo(labelX, labelY + chipHeight, labelX, labelY, radius);
    ctx.arcTo(labelX, labelY, labelX + chipWidth, labelY, radius);
    ctx.closePath();
    ctx.fillStyle = "rgba(255, 255, 255, 0.94)";
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#e2e8f0";
    ctx.stroke();

    ctx.fillStyle = "#1e293b";
    ctx.fillText(vehicle.vehicleId, labelX + paddingX, labelY + 12);
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

      // Map-style background gradient
      const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      bgGradient.addColorStop(0, "#f8fafc");
      bgGradient.addColorStop(1, "#eef2ff");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();

      ctx.scale(
        zoomRef.current,
        zoomRef.current
      );

      // Background Grid (soft dot grid instead of harsh lines)
      const gridSize = 40;
      ctx.fillStyle = "#dbe3f0";

      for (let gx = gridSize; gx < canvas.width; gx += gridSize) {
        for (let gy = gridSize; gy < canvas.height; gy += gridSize) {
          ctx.beginPath();
          ctx.arc(gx, gy, 1.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 1. Ease each vehicle's true position toward its real target coordinate
      animatedVehicles.current.forEach((vehicle) => {
        vehicle.currentX += (vehicle.targetX - vehicle.currentX) * 0.08;
        vehicle.currentY += (vehicle.targetY - vehicle.currentY) * 0.08;
      });

      // 2. Figure out decluttered marker positions so close-together vehicles
      // don't visually stack on top of each other
      const declutterTargets = resolveMarkerOverlaps(
        Array.from(animatedVehicles.current.values()).map((vehicle) => ({
          id: vehicle.vehicleId,
          x: vehicle.currentX,
          y: vehicle.currentY,
        }))
      );
      const declutterMap = new Map(
        declutterTargets.map((target) => [target.id, target])
      );

      // 3. Smoothly ease the rendered marker position toward that decluttered
      // target, so markers glide apart instead of snapping
      animatedVehicles.current.forEach((vehicle) => {
        const target = declutterMap.get(vehicle.vehicleId);

        if (!target) return;

        vehicle.renderX += (target.x - vehicle.renderX) * 0.15;
        vehicle.renderY += (target.y - vehicle.renderY) * 0.15;
      });

      // Draw Vehicles
      const placedLabels: LabelBox[] = [];

      animatedVehicles.current.forEach((vehicle) => {
        drawVehicle(ctx, vehicle, placedLabels, now);
      });

      ctx.restore();

      // FPS Counter, styled as a small floating chip
      const fpsText = `${fpsRef.current} FPS`;
      ctx.font = "600 12px Arial";
      const fpsTextWidth = ctx.measureText(fpsText).width;
      const chipPadX = 8;
      const chipW = fpsTextWidth + chipPadX * 2;
      const chipH = 22;
      const chipX = 14;
      const chipY = 14;
      const chipRadius = 6;

      ctx.beginPath();
      ctx.moveTo(chipX + chipRadius, chipY);
      ctx.arcTo(chipX + chipW, chipY, chipX + chipW, chipY + chipH, chipRadius);
      ctx.arcTo(chipX + chipW, chipY + chipH, chipX, chipY + chipH, chipRadius);
      ctx.arcTo(chipX, chipY + chipH, chipX, chipY, chipRadius);
      ctx.arcTo(chipX, chipY, chipX + chipW, chipY, chipRadius);
      ctx.closePath();
      ctx.fillStyle = "rgba(15, 23, 42, 0.78)";
      ctx.fill();

      ctx.fillStyle = "#f8fafc";
      ctx.fillText(fpsText, chipX + chipPadX, chipY + 15);

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

        <span className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-blue-100">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
          </span>
          Live Tracking
        </span>
      </div>

      <canvas
        ref={canvasRef}
        className="w-full rounded-xl border border-slate-200 bg-white shadow-md"
      />
      <div className="mt-3 flex flex-wrap gap-4 text-sm font-medium">
        <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-green-700 ring-1 ring-green-100">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          Running
        </span>

        <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-amber-600 ring-1 ring-amber-100">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          Idle
        </span>

        <span className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-red-600 ring-1 ring-red-100">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          Offline
        </span>

        <span className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-blue-600 ring-1 ring-blue-100">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          Geofence Alert
        </span>
      </div>
    </div>
  );
}

export default FleetCanvas;


// import { useEffect, useMemo, useRef } from "react";

// import { useVehicleContext } from "../../context/VehicleContext";


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
//   const { vehicles } = useVehicleContext();
//   console.log("Vehicles:", vehicles);
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   const animatedVehicles = useRef<Map<string, AnimatedVehicle>>(new Map());

//   const zoomRef = useRef(1);

//   const fpsRef = useRef(0);
//   const lastTime = useRef(performance.now());

// //   const greenTruck = useRef(new Image());
// // const yellowTruck = useRef(new Image());
// // const redTruck = useRef(new Image());
// // const blueTruck = useRef(new Image());

// // useEffect(() => {
// //   greenTruck.current.src = truckGreen;
// //   yellowTruck.current.src = truckYellow;
// //   redTruck.current.src = truckRed;
// //   blueTruck.current.src = truckBlue;
// // }, []);

//   const highlightedVehicles = useMemo(
//     () => new Set(geofenceAlerts.map((alert) => alert.vehicleId)),
//     [geofenceAlerts]
//   );

//   const projectCoordinates = (
//   latitude: number,
//   longitude: number
// ) => {
//   const canvas = canvasRef.current;

//   if (!canvas) {
//     return { x: 0, y: 0 };
//   }

//   // India GPS Bounds
//   const MIN_LAT = 8;
//   const MAX_LAT = 38;

//   const MIN_LNG = 68;
//   const MAX_LNG = 98;

//   const padding = 30;

//   const x =
//     ((longitude - MIN_LNG) /
//       (MAX_LNG - MIN_LNG)) *
//       (canvas.width - padding * 2) +
//     padding;

//   const y =
//     canvas.height -
//     (((latitude - MIN_LAT) /
//       (MAX_LAT - MIN_LAT)) *
//       (canvas.height - padding * 2) +
//       padding);

//   return { x, y };
// };

//   // Auto Resize Canvas
//   useEffect(() => {
//     const resize = () => {
//       if (!canvasRef.current) return;

//       canvasRef.current.width =
//         canvasRef.current.parentElement?.clientWidth ?? 900;

//       canvasRef.current.height = 500;
//     };

//     resize();

//     window.addEventListener("resize", resize);

//     return () => {
//       window.removeEventListener("resize", resize);
//     };
//   }, []);

//   // Zoom
//   useEffect(() => {
//     const canvas = canvasRef.current;

//     if (!canvas) return;

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


// useEffect(() => {
//   vehicles.forEach((vehicle) => {
//     // const x = vehicle.longitude * 8;
//     // const y = vehicle.latitude * 8;
//     const { x, y } = projectCoordinates(
//   vehicle.latitude,
//   vehicle.longitude
// );

//     const existing = animatedVehicles.current.get(vehicle.vehicleId);

//     if (existing) {
//       existing.targetX = x;
//       existing.targetY = y;
//       existing.status = vehicle.status;
//     } else {
//       animatedVehicles.current.set(vehicle.vehicleId, {
//         vehicleId: vehicle.vehicleId,
//         currentX: x,
//         currentY: y,
//         targetX: x,
//         targetY: y,
//         status: vehicle.status,
//       });
//     }
//   });

//   const ids = new Set(vehicles.map((v) => v.vehicleId));

//   animatedVehicles.current.forEach((_, id) => {
//     if (!ids.has(id)) {
//       animatedVehicles.current.delete(id);
//     }
//   });
// }, [vehicles]);

//   const drawVehicle = (
//     ctx: CanvasRenderingContext2D,
//     vehicle: AnimatedVehicle
//   ) => {
//     const canvas = canvasRef.current;

//     if (!canvas) return;

//     // Smooth Animation
//     vehicle.currentX +=
//       (vehicle.targetX - vehicle.currentX) * 0.08;

//     vehicle.currentY +=
//       (vehicle.targetY - vehicle.currentY) * 0.08;

//     // Skip Invisible Vehicles
//     if (
//       vehicle.currentX < 0 ||
//       vehicle.currentX > canvas.width ||
//       vehicle.currentY < 0 ||
//       vehicle.currentY > canvas.height
//     ) {
//       return;
//     }

//     const markerColor: Record<string, string> = {
//       Running: "#16a34a",
//       Idle: "#f59e0b",
//       Offline: "#ef4444",
//       moving: "#16a34a",
//       idle: "#f59e0b",
//       offline: "#ef4444",
//     };

//     // // Vehicle Marker
//     // ctx.beginPath();
//     // ctx.arc(
//     //   vehicle.currentX,
//     //   vehicle.currentY,
//     //   9,
//     //   0,
//     //   Math.PI * 2
//     // );

//     // ctx.fillStyle = highlightedVehicles.has(vehicle.vehicleId)
//     //   ? "#2563eb"
//     //   : markerColor[vehicle.status] ?? "#6b7280";

//     // ctx.fill();
// ctx.font = "22px Arial";

// ctx.fillText(
//   "🚚",
//   vehicle.currentX - 10,
//   vehicle.currentY + 8
// );

//     // Border
//     ctx.strokeStyle = "#ffffff";
//     ctx.lineWidth = 2;
//     ctx.stroke();

//     // Direction Indicator
//     ctx.beginPath();
//     ctx.moveTo(vehicle.currentX, vehicle.currentY);
//     ctx.lineTo(vehicle.currentX + 15, vehicle.currentY);
//     ctx.strokeStyle = "#2563eb";
//     ctx.lineWidth = 2;
//     ctx.stroke();

//     // Vehicle ID
//     ctx.fillStyle = "#111827";
//     ctx.font = "13px Arial";
//     ctx.fillText(
//       vehicle.vehicleId,
//       vehicle.currentX + 14,
//       vehicle.currentY
//     );
//   };

//   // Animation Loop
//   useEffect(() => {
//     let animationId: number;

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

//       ctx.clearRect(
//         0,
//         0,
//         canvas.width,
//         canvas.height
//       );

//       ctx.save();

//       ctx.scale(
//         zoomRef.current,
//         zoomRef.current
//       );

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
//         drawVehicle(ctx, vehicle);
//       });

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
//       <div className="mt-3 flex flex-wrap gap-6 text-sm font-medium">
//       <span className="text-green-600">
//         🟢 Running
//       </span>

//       <span className="text-yellow-500">
//         🟡 Idle
//       </span>

//       <span className="text-red-600">
//         🔴 Offline
//       </span>

//       <span className="text-blue-600">
//         🔵 Geofence Alert
//       </span>
//     </div>
//     </div>
//   );
// }

// export default FleetCanvas;
