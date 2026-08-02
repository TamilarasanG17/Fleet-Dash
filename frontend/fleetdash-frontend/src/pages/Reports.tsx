import { useMemo, useState } from "react";

import { useVehicleContext } from "../context/VehicleContext";
import type { GeofenceAlert } from "../types/geofence";

// The current vehicle model (from VehicleList) exposes vehicleId,
// vehicleNumber, driverName, vehicleType and status. distanceKm / idleMinutes
// aren't part of that model yet — they're typed as optional here so the
// table shows "—" until the backend starts sending them, and will pick them
// up automatically once it does.
interface ReportVehicle {
  vehicleId: string;
  vehicleNumber: string;
  driverName: string;
  vehicleType: string;
  status: string;
  distanceKm?: number;
  idleMinutes?: number;
}

const statusTheme: Record<string, { badge: string; dot: string; label: string }> = {
  moving: { badge: "bg-green-500", dot: "bg-green-500", label: "Moving" },
  idle: { badge: "bg-amber-500", dot: "bg-amber-500", label: "Idle" },
  offline: { badge: "bg-red-500", dot: "bg-red-500", label: "Offline" },
};

// --- Small inline icons, kept local so no extra icon library is required ---

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M12 3v12" />
      <path d="M7 10l5 5 5-5" />
      <path d="M4 21h16" />
    </svg>
  );
}

function EnterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
      <path d="M4 12h11" />
      <path d="M11 6l6 6-6 6" />
      <path d="M20 4v16" />
    </svg>
  );
}

function ExitIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
      <path d="M20 12H9" />
      <path d="M13 6l-6 6 6 6" />
      <path d="M4 4v16" />
    </svg>
  );
}

// --- CSV helpers ---

function escapeCsvValue(value: string | number) {
  const str = String(value ?? "");
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const csv = [headers, ...rows]
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function StatCard({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}

function Reports() {
  const { vehicles, geofenceAlerts } = useVehicleContext();
  const [searchTerm, setSearchTerm] = useState("");

  // Cast to the permissive report shape described above — swap this for the
  // real Vehicle type once distanceKm / idleMinutes exist on it.
  const reportVehicles = vehicles as unknown as ReportVehicle[];

  const filteredVehicles = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return reportVehicles;

    return reportVehicles.filter(
      (vehicle) =>
        vehicle.vehicleId.toLowerCase().includes(term) ||
        vehicle.driverName?.toLowerCase().includes(term) ||
        vehicle.vehicleNumber?.toLowerCase().includes(term)
    );
  }, [reportVehicles, searchTerm]);

  const statusCounts = useMemo(() => {
    return reportVehicles.reduce(
      (acc, vehicle) => {
        acc.total += 1;
        if (vehicle.status === "moving") acc.moving += 1;
        else if (vehicle.status === "idle") acc.idle += 1;
        else acc.offline += 1;
        return acc;
      },
      { total: 0, moving: 0, idle: 0, offline: 0 }
    );
  }, [reportVehicles]);

  const sortedAlerts = useMemo(() => {
    return [...geofenceAlerts].sort(
      (a: GeofenceAlert, b: GeofenceAlert) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [geofenceAlerts]);

  const latestAlertByVehicle = useMemo(() => {
    const map = new Map<string, GeofenceAlert>();
    sortedAlerts.forEach((alert) => {
      if (!map.has(alert.vehicleId)) map.set(alert.vehicleId, alert);
    });
    return map;
  }, [sortedAlerts]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return timestamp;
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const lastAlertLabel = (vehicleId: string) => {
    const alert = latestAlertByVehicle.get(vehicleId);
    if (!alert) return "No alerts yet";
    return `${alert.type === "ENTER" ? "Entered" : "Exited"} ${alert.zoneName} · ${formatTime(alert.timestamp)}`;
  };

  const exportVehiclesCsv = () => {
    downloadCsv(
      `fleet-vehicle-summary-${new Date().toISOString().slice(0, 10)}.csv`,
      ["Vehicle ID", "Number", "Driver", "Type", "Status", "Distance (km)", "Idle (min)", "Last Alert"],
      filteredVehicles.map((vehicle) => [
        vehicle.vehicleId,
        vehicle.vehicleNumber,
        vehicle.driverName,
        vehicle.vehicleType,
        vehicle.status,
        vehicle.distanceKm ?? "",
        vehicle.idleMinutes ?? "",
        lastAlertLabel(vehicle.vehicleId),
      ])
    );
  };

  const exportAlertsCsv = () => {
    downloadCsv(
      `fleet-alert-log-${new Date().toISOString().slice(0, 10)}.csv`,
      ["Vehicle ID", "Event", "Zone", "Timestamp"],
      sortedAlerts.map((alert) => [
        alert.vehicleId,
        alert.type === "ENTER" ? "Entered" : "Exited",
        alert.zoneName,
        alert.timestamp,
      ])
    );
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-lg">
      <style>{`
        .reports-scroll::-webkit-scrollbar { width: 6px; }
        .reports-scroll::-webkit-scrollbar-thumb { background-color: #e2e8f0; border-radius: 9999px; }
        .reports-scroll::-webkit-scrollbar-track { background: transparent; }
      `}</style>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Fleet Reports</h2>
          <p className="text-xs text-slate-400">Live vehicle summary and geofence history</p>
        </div>

        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <SearchIcon />
          </span>
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search vehicle or driver..."
            className="w-56 rounded-lg border border-slate-200 py-1.5 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Summary stat cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total" value={statusCounts.total} accent="text-slate-800" />
        <StatCard label="Moving" value={statusCounts.moving} accent="text-green-600" />
        <StatCard label="Idle" value={statusCounts.idle} accent="text-amber-600" />
        <StatCard label="Offline" value={statusCounts.offline} accent="text-red-600" />
      </div>

      {/* Vehicle activity summary */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold text-slate-700">Vehicle Activity Summary</h3>
          <button
            type="button"
            onClick={exportVehiclesCsv}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
          >
            <DownloadIcon />
            Export CSV
          </button>
        </div>

        <div className="reports-scroll max-h-80 overflow-auto rounded-xl border border-slate-100">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-3 py-2">Vehicle</th>
                <th className="px-3 py-2">Driver</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Distance</th>
                <th className="px-3 py-2">Idle</th>
                <th className="px-3 py-2">Last Alert</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-slate-400">
                    No vehicles match your search
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((vehicle) => {
                  const theme = statusTheme[vehicle.status] ?? {
                    badge: "bg-slate-400",
                    dot: "bg-slate-400",
                    label: vehicle.status,
                  };

                  return (
                    <tr key={vehicle.vehicleId} className="border-t border-slate-100">
                      <td className="px-3 py-2 font-medium text-slate-800">{vehicle.vehicleId}</td>
                      <td className="px-3 py-2 text-slate-500">{vehicle.driverName}</td>
                      <td className="px-3 py-2 text-slate-500">{vehicle.vehicleType}</td>
                      <td className="px-3 py-2">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${theme.badge}`}>
                          {theme.label}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-slate-500">
                        {vehicle.distanceKm !== undefined ? `${vehicle.distanceKm} km` : "—"}
                      </td>
                      <td className="px-3 py-2 text-slate-500">
                        {vehicle.idleMinutes !== undefined ? `${vehicle.idleMinutes} min` : "—"}
                      </td>
                      <td className="px-3 py-2 text-slate-500">{lastAlertLabel(vehicle.vehicleId)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Geofence alert history */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold text-slate-700">Geofence Alert History</h3>
          <button
            type="button"
            onClick={exportAlertsCsv}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
          >
            <DownloadIcon />
            Export CSV
          </button>
        </div>

        {sortedAlerts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-400">
            No geofence alerts recorded yet
          </div>
        ) : (
          <div className="reports-scroll flex max-h-72 flex-col gap-2 overflow-auto pr-1">
            {sortedAlerts.map((alert) => {
              const isEnter = alert.type === "ENTER";
              return (
                <div
                  key={alert.id}
                  className={`flex items-center gap-3 rounded-lg border-l-4 px-3 py-2 text-sm ${
                    isEnter ? "border-green-500 bg-green-50/60" : "border-red-500 bg-red-50/60"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white ${
                      isEnter ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {isEnter ? <EnterIcon /> : <ExitIcon />}
                  </span>
                  <span className="font-medium text-slate-800">{alert.vehicleId}</span>
                  <span className={isEnter ? "text-green-700" : "text-red-700"}>
                    {isEnter ? "Entered" : "Exited"} {alert.zoneName}
                  </span>
                  <span className="ml-auto shrink-0 text-xs text-slate-400">
                    {formatTime(alert.timestamp)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;