import useVehicles from "./useVehicles";

function useDashboardStats() {
  const { vehicles } = useVehicles();

  const totalVehicles = vehicles.length;

  const runningVehicles = vehicles.filter(
    (vehicle) => vehicle.status === "moving"
  ).length;

  const idleVehicles = vehicles.filter(
    (vehicle) => vehicle.status === "idle"
  ).length;

  const offlineVehicles = vehicles.filter(
    (vehicle) => vehicle.status === "offline"
  ).length;

  return {
    totalVehicles,
    runningVehicles,
    idleVehicles,
    offlineVehicles,
  };
}

export default useDashboardStats;