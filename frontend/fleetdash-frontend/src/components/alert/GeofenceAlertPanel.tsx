// import { useVehicleContext } from "../../context/VehicleContext";
// import type { GeofenceAlert } from "../../types/geofence";

// function GeofenceAlertPanel() {
//   const { geofenceAlerts } = useVehicleContext();

//   return (
//     <div className="rounded-xl bg-white p-5 shadow">
//       <h2 className="mb-4 text-xl font-bold text-red-600">
//         Live Geofence Alerts
//       </h2>

//       {geofenceAlerts.length === 0 ? (
//         <p className="text-gray-500">
//           No Geofence Alerts
//         </p>
//       ) : (
//         geofenceAlerts.map((alert: GeofenceAlert) => (
//           <div
//             key={alert.id}
//             className={`mb-3 rounded-lg p-3 text-white ${
//               alert.type === "ENTER"
//                 ? "bg-green-600"
//                 : "bg-red-600"
//             }`}
//           >
//             <p className="font-semibold">
//               {alert.vehicleId}
//             </p>

//             <p>
//               {alert.type === "ENTER"
//                 ? "Entered"
//                 : "Exited"}{" "}
//               {alert.zoneName}
//             </p>

//             <p className="text-sm">
//               {alert.timestamp}
//             </p>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }

// export default GeofenceAlertPanel;

import { useVehicleContext } from "../../context/VehicleContext";
import type { GeofenceAlert } from "../../types/geofence";

// Small inline icons so no extra icon library is required.
function EnterIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M4 12h11" />
      <path d="M11 6l6 6-6 6" />
      <path d="M20 4v16" />
    </svg>
  );
}

function ExitIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M20 12H9" />
      <path d="M13 6l-6 6 6 6" />
      <path d="M4 4v16" />
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8"
    >
      <path d="M12 21s-7-5.14-7-11a7 7 0 0 1 14 0c0 5.86-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

// Purely presentational timestamp formatting — no change to the underlying data.
function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return { time: timestamp, full: timestamp };
  }

  return {
    time: date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    full: date.toLocaleString(),
  };
}

function GeofenceAlertPanel() {
  const { geofenceAlerts } = useVehicleContext();

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-lg">
      <style>{`
        @keyframes geofenceSlideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .geofence-alert-item {
          animation: geofenceSlideIn 0.3s ease-out;
        }
        .geofence-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .geofence-scroll::-webkit-scrollbar-thumb {
          background-color: #e2e8f0;
          border-radius: 9999px;
        }
        .geofence-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-600" />
          </span>
          <h2 className="text-xl font-bold text-red-600">
            Live Geofence Alerts
          </h2>
        </div>

        {geofenceAlerts.length > 0 && (
          <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600 ring-1 ring-red-100">
            {geofenceAlerts.length}
          </span>
        )}
      </div>

      {geofenceAlerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 py-10 text-slate-400">
          <EmptyIcon />
          <p className="text-sm font-medium">No Geofence Alerts</p>
          <p className="text-xs text-slate-400">
            Alerts will appear here in real time
          </p>
        </div>
      ) : (
        <div className="geofence-scroll flex max-h-[520px] flex-col gap-3 overflow-y-auto pr-1">
          {geofenceAlerts.map((alert: GeofenceAlert, index: number) => {
            const isEnter = alert.type === "ENTER";
            const { time, full } = formatTimestamp(alert.timestamp);

            return (
              <div
                key={alert.id}
                className={`geofence-alert-item flex items-start gap-3 rounded-xl border-l-4 p-3.5 shadow-sm transition-shadow hover:shadow-md ${
                  isEnter
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    isEnter
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {isEnter ? <EnterIcon /> : <ExitIcon />}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold text-slate-800">
                      {alert.vehicleId}
                    </p>
                    {index === 0 && (
                      <span className="shrink-0 rounded-full bg-white/70 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500 ring-1 ring-slate-200">
                        Latest
                      </span>
                    )}
                  </div>

                  <p
                    className={`text-sm ${
                      isEnter ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {isEnter ? "Entered" : "Exited"} {alert.zoneName}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400" title={full}>
                    {time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default GeofenceAlertPanel;