import AlertPanel from "../components/alert/AlertPanel";
import DashboardGrid from "../components/dashboard/DashboardGrid";
import LiveMap from "../components/map/LiveMap";
import VehicleList from "../components/vehicle/VehicleList";
import useVehicles from "../hooks/useVehicles";

function Dashboard() {
  const { vehicles } = useVehicles();

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">
        Fleet Dashboard
      </h1>

      <p className="mb-6">
        Connected Vehicles: <b>{vehicles.length}</b>
      </p>

      <DashboardGrid />

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LiveMap />
        </div>

        <div className="space-y-6">
          <VehicleList />
          <AlertPanel />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;