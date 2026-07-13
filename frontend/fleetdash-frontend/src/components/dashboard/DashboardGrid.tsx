import DashboardCard from "./DashboardCard";
import useVehicles from "../../hooks/useVehicles";

function DashboardGrid() {
  const { vehicles } = useVehicles();

  const total = vehicles.length;
  const running = vehicles.filter(
    (v) => v.status === "moving"
  ).length;

  const idle = vehicles.filter(
    (v) => v.status === "idle"
  ).length;

  const offline = vehicles.filter(
    (v) => v.status === "offline"
  ).length;

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardCard
        title="Total Vehicles"
        value={total}
        color="text-blue-600"
      />

      <DashboardCard
        title="Running"
        value={running}
        color="text-green-600"
      />

      <DashboardCard
        title="Idle"
        value={idle}
        color="text-yellow-500"
      />

      <DashboardCard
        title="Offline"
        value={offline}
        color="text-red-600"
      />
    </div>
  );
}

export default DashboardGrid;