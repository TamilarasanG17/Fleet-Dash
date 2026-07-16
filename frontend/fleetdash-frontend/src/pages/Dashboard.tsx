import AlertPanel from "../components/alert/AlertPanel";
import DashboardGrid from "../components/dashboard/DashboardGrid";
import MapCard from "../components/map/MapCard";
import VehicleList from "../components/vehicle/VehicleList";

function Dashboard() {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        Fleet Dashboard
      </h1>

      <DashboardGrid />

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <MapCard />
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