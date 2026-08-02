import { useVehicleContext } from "../../context/VehicleContext";

// Small inline icons so no extra icon library is required.
function TruckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M1 3h13v13H1z" />
      <path d="M14 8h4l3 3v5h-7V8z" />
      <circle cx="6" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </svg>
  );
}

function IdIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 9h4M7 13h6" />
    </svg>
  );
}

function DriverIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
    >
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 20c1.2-4 4.2-6 7-6s5.8 2 7 6" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
    >
      <path d="M20 12l-8 8-9-9V4h7z" />
      <circle cx="7.5" cy="7.5" r="1.2" />
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
      <path d="M1 3h13v13H1z" />
      <path d="M14 8h4l3 3v5h-7V8z" />
      <circle cx="6" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </svg>
  );
}

const statusTheme: Record<
  string,
  { dot: string; badge: string; ring: string; label: string; pulse: boolean }
> = {
  moving: {
    dot: "bg-green-500",
    badge: "bg-green-500",
    ring: "border-green-500",
    label: "Moving",
    pulse: true,
  },
  idle: {
    dot: "bg-amber-500",
    badge: "bg-amber-500",
    ring: "border-amber-500",
    label: "Idle",
    pulse: false,
  },
  offline: {
    dot: "bg-red-500",
    badge: "bg-red-500",
    ring: "border-red-500",
    label: "Offline",
    pulse: false,
  },
};

function VehicleList() {
  const { vehicles } = useVehicleContext();

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-lg">
      <style>{`
        @keyframes vehicleSlideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .vehicle-card {
          animation: vehicleSlideIn 0.3s ease-out;
        }
        .vehicle-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .vehicle-scroll::-webkit-scrollbar-thumb {
          background-color: #e2e8f0;
          border-radius: 9999px;
        }
        .vehicle-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Live Vehicles</h2>

        {vehicles.length > 0 && (
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
            {vehicles.length}
          </span>
        )}
      </div>

      {vehicles.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 py-10 text-slate-400">
          <EmptyIcon />
          <p className="text-sm font-medium">No Vehicles Connected</p>
          <p className="text-xs text-slate-400">
            Connected vehicles will show up here
          </p>
        </div>
      ) : (
        <div className="vehicle-scroll flex max-h-[560px] flex-col gap-3 overflow-y-auto pr-1">
          {vehicles.map((vehicle) => {
            const theme = statusTheme[vehicle.status] ?? {
              dot: "bg-slate-400",
              badge: "bg-slate-400",
              ring: "border-slate-300",
              label: vehicle.status,
              pulse: false,
            };

            return (
              <div
                key={vehicle.vehicleId}
                className={`vehicle-card flex items-start gap-3 rounded-xl border-l-4 bg-slate-50/60 p-3.5 shadow-sm ring-1 ring-slate-100 transition-shadow hover:shadow-md ${theme.ring}`}
              >
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-white">
                  <TruckIcon />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate font-semibold text-slate-800">
                      {vehicle.vehicleId}
                    </h3>

                    <span
                      className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white ${theme.badge}`}
                    >
                      <span className="relative flex h-1.5 w-1.5">
                        {theme.pulse && (
                          <span
                            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${theme.dot}`}
                          />
                        )}
                        <span
                          className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
                            theme.pulse ? theme.dot : "bg-white/80"
                          }`}
                        />
                      </span>
                      {theme.label}
                    </span>
                  </div>

                  <div className="mt-1.5 space-y-1 text-sm text-slate-500">
                    <p className="flex items-center gap-1.5">
                      <IdIcon />
                      {vehicle.vehicleNumber}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <DriverIcon />
                      {vehicle.driverName}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <TagIcon />
                      {vehicle.vehicleType}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default VehicleList;
