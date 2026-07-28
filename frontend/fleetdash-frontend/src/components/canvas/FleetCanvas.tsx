import { useEffect, useRef } from "react";
import useVehicle from "../../hooks/useVehicles";

function FleetCanvas() {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const { vehicles } = useVehicle();

    useEffect(() => {

        const canvas = canvasRef.current;

        if (!canvas) return;

        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        canvas.width = 900;
        canvas.height = 500;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        vehicles.forEach(vehicle => {

            ctx.beginPath();

            ctx.arc(
                vehicle.longitude * 8,
                vehicle.latitude * 8,
                8,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                vehicle.status === "moving"
                    ? "#16a34a"
                    : "#eab308";

            ctx.fill();

            ctx.fillStyle = "#000";

            ctx.font = "14px Arial";

            ctx.fillText(
                vehicle.vehicleId,
                vehicle.longitude * 8 + 12,
                vehicle.latitude * 8
            );

        });

    }, [vehicles]);

    return (

        <canvas
            ref={canvasRef}
            className="rounded-xl border bg-white shadow w-full"
        />

    );

}

export default FleetCanvas;