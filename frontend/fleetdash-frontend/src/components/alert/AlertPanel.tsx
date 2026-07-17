
import { useVehicleContext } from "../../context/VehicleContext";
function AlertPanel() {
  const { alerts } = useVehicleContext();

  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <h2 className="mb-4 text-xl font-bold text-red-600">
        Live Alerts
      </h2>

      {alerts.length === 0 ? (
        <p className="text-gray-500">
          No Active Alerts
        </p>
      ) : (
        alerts.map((alert, index) => (
          <div
            key={index}
            className="mb-3 rounded-lg bg-red-100 p-3"
          >
            {alert}
          </div>
        ))
      )}
    </div>
  );
}

export default AlertPanel;