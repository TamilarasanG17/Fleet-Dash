import AlertPanel from "../components/alert/AlertPanel";
import DashboardGrid from "../components/dashboard/DashboardGrid";
import LiveMap from "../components/map/LiveMap";
import VehicleList from "../components/vehicle/VehicleList";

function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Fleet Dashboard
      </h1>

      <DashboardGrid />

       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">

        <div className="xl:col-span-2">
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