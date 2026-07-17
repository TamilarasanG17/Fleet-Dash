import DashboardCard from "./DashboardCard";
import useDashboardStats from "../../hooks/useDashboardStats";

function DashboardGrid() {
  const {
    totalVehicles,
    runningVehicles,
    idleVehicles,
    offlineVehicles,
  } = useDashboardStats();

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      <DashboardCard
        title="Total Vehicles"
        value={totalVehicles}
        color="text-blue-600"
      />

      <DashboardCard
        title="Running"
        value={runningVehicles}
        color="text-green-600"
      />

      <DashboardCard
        title="Idle"
        value={idleVehicles}
        color="text-yellow-500"
      />

      <DashboardCard
        title="Offline"
        value={offlineVehicles}
        color="text-red-600"
      />
    </div>
  );
}

export default DashboardGrid;