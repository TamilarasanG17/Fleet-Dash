import { useVehicleContext } from "../../context/VehicleContext";

function ConnectionStatus() {
  const { connected } = useVehicleContext();

  return (
    <div className="flex items-center gap-2">
      <div
        className={`h-3 w-3 rounded-full ${
          connected ? "bg-green-500" : "bg-red-500"
        }`}
      />

      <span className="text-sm font-medium">
        {connected ? "Connected" : "Disconnected"}
      </span>
    </div>
  );
}

export default ConnectionStatus;