import { alerts } from "../../data/alerts";

function AlertPanel() {
  return (
    <div className="bg-white rounded-xl shadow p-5">

      <h2 className="font-bold text-xl mb-4 text-red-600">
        Alerts
      </h2>

      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="bg-red-100 p-3 rounded-lg mb-3"
        >
          {alert.message}
        </div>
      ))}
    </div>
  );
}

export default AlertPanel;