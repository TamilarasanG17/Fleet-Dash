// import AlertPanel from "../components/alert/AlertPanel";
// import ErrorMessage from "../components/common/ErrorMessage";
// import Loader from "../components/common/Loader";
// import DashboardGrid from "../components/dashboard/DashboardGrid";
// import MapCard from "../components/map/MapCard";
// import VehicleList from "../components/vehicle/VehicleList";
// import useVehicles from "../hooks/useVehicles";

// function Dashboard() {

//   const { loading, error} = useVehicles();

//   if (loading) {

//     return <Loader/>;

//   }

//   if (error) {

//     return <ErrorMessage message={error}/>;

//   }

//   return (
//     <div className="space-y-8">
//       <h1 className="text-3xl font-bold">
//         Fleet Dashboard
//       </h1>

//       <DashboardGrid />

//       <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
//         <div className="space-y-6 xl:col-span-8">
//           <MapCard />

//           <AlertPanel />
//         </div>

//         <div className="xl:col-span-4">
//           <VehicleList />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;


// import ErrorMessage from "../components/common/ErrorMessage";
// import Loader from "../components/common/Loader";
// import DashboardGrid from "../components/dashboard/DashboardGrid";
// import MapCard from "../components/map/MapCard";
// import FleetCanvas from "../components/canvas/FleetCanvas";
// import VehicleList from "../components/vehicle/VehicleList";
// import GeofenceAlertPanel from "../components/alert/GeofenceAlertPanel";
// import useVehicles from "../hooks/useVehicles";
// import { useVehicleContext } from "../context/VehicleContext";

// function Dashboard() {
//   const { loading, error } = useVehicles();
//   const { geofenceAlerts } = useVehicleContext();

//   if (loading) {
//     return <Loader />;
//   }

//   if (error) {
//     return <ErrorMessage message={error} />;
//   }

//   return (
//     <div className="space-y-8">
//       <h1 className="text-3xl font-bold">Fleet Dashboard</h1>

//       <DashboardGrid />

//       <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
//         {/* Left Side */}
//         <div className="space-y-6 xl:col-span-8">
//           <MapCard />
//           <FleetCanvas geofenceAlerts={geofenceAlerts} />
//         </div>

//         {/* Right Side */}
//         <div className="xl:col-span-4">
//           <div className="space-y-6">
//             <VehicleList />
//             <GeofenceAlertPanel />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

import ErrorMessage from "../components/common/ErrorMessage";
import Loader from "../components/common/Loader";
import DashboardGrid from "../components/dashboard/DashboardGrid";
import MapCard from "../components/map/MapCard";
import FleetCanvas from "../components/canvas/FleetCanvas";
import VehicleList from "../components/vehicle/VehicleList";
import GeofenceAlertPanel from "../components/alert/GeofenceAlertPanel";
import useVehicles from "../hooks/useVehicles";
import { useVehicleContext } from "../context/VehicleContext";

function Dashboard() {
  const { loading, error } = useVehicles();
  const { geofenceAlerts } = useVehicleContext();

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="space-y-8">
      <style>{`
        @keyframes dashboardFadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dashboard-section {
          animation: dashboardFadeInUp 0.45s ease-out both;
        }
      `}</style>

      <div>
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
          Fleet Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Overview of your live fleet operations
        </p>
      </div>

      <div className="dashboard-section" style={{ animationDelay: "0.05s" }}>
        <DashboardGrid />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Side */}
        <div className="space-y-6 lg:col-span-8">
          <div className="dashboard-section" style={{ animationDelay: "0.1s" }}>
            <MapCard />
          </div>
          <div className="dashboard-section" style={{ animationDelay: "0.15s" }}>
            <FleetCanvas geofenceAlerts={geofenceAlerts} />
          </div>
        </div>

        {/* Right Side */}
        <div className="space-y-6 lg:col-span-4">
          <div className="dashboard-section" style={{ animationDelay: "0.2s" }}>
            <VehicleList />
          </div>
          <div className="dashboard-section" style={{ animationDelay: "0.25s" }}>
            <GeofenceAlertPanel />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;