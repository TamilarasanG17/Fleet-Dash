import AlertPanel from "../components/alert/AlertPanel";
import ErrorMessage from "../components/common/ErrorMessage";
import Loader from "../components/common/Loader";
import DashboardGrid from "../components/dashboard/DashboardGrid";
import MapCard from "../components/map/MapCard";
import VehicleList from "../components/vehicle/VehicleList";
import useVehicles from "../hooks/useVehicles";

function Dashboard() {

  const { loading, error} = useVehicles();

  if (loading) {

    return <Loader/>;

  }

  if (error) {

    return <ErrorMessage message={error}/>;

  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">
        Fleet Dashboard
      </h1>

      <DashboardGrid />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <MapCard />

          <AlertPanel />
        </div>

        <div className="xl:col-span-4">
          <VehicleList />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;