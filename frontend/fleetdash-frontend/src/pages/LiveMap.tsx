import FleetCanvas from "../components/canvas/FleetCanvas";
import { useVehicleContext } from "../context/VehicleContext";

function LiveMap() {
  const { geofenceAlerts } = useVehicleContext();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Live Map</h1>
      <FleetCanvas geofenceAlerts={geofenceAlerts} />
    </div>
  );
}

export default LiveMap;