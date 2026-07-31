import { useVehicleContext } from "../../context/VehicleContext";
import type { GeofenceAlert } from "../../types/geofence";

function GeofenceAlertPanel() {
  const { geofenceAlerts } = useVehicleContext();

  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <h2 className="mb-4 text-xl font-bold text-red-600">
        Live Geofence Alerts
      </h2>

      {geofenceAlerts.length === 0 ? (
        <p className="text-gray-500">
          No Geofence Alerts
        </p>
      ) : (
        geofenceAlerts.map((alert: GeofenceAlert) => (
          <div
            key={alert.id}
            className={`mb-3 rounded-lg p-3 text-white ${
              alert.type === "ENTER"
                ? "bg-green-600"
                : "bg-red-600"
            }`}
          >
            <p className="font-semibold">
              {alert.vehicleId}
            </p>

            <p>
              {alert.type === "ENTER"
                ? "Entered"
                : "Exited"}{" "}
              {alert.zoneName}
            </p>

            <p className="text-sm">
              {alert.timestamp}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default GeofenceAlertPanel;