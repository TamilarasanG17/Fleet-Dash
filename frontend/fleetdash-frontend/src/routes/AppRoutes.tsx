// import { Routes, Route } from "react-router-dom";

// import DashboardLayout from "../components/layout/DashboardLayout";
// import Dashboard from "../pages/Dashboard";
// import Settings from "../pages/Settings";
// import Reports from "../pages/Reports";
// import Vehicles from "../pages/Vechicles";

// function AppRoutes() {
//   return (
//     <Routes>
//       <Route element={<DashboardLayout />}>
//         <Route path="/" element={<Dashboard />} />
//         <Route path="/settings" element={<Settings />} />
//         <Route path="/reports" element={<Reports />} />
//         <Route path="/vehicles" element={<Vehicles />} />
//       </Route>

//       <Route
//         path="*"
//         element={
//           <h1 className="mt-20 text-center text-3xl font-bold">
//             404 - Page Not Found
//           </h1>
//         }
//       />
//     </Routes>
//   );
// }

// export default AppRoutes;

import { Routes, Route } from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import Settings from "../pages/Settings";
import Reports from "../pages/Reports";
import Vehicles from "../pages/Vehicles";
import LiveMap from "../pages/LiveMap";
import Alerts from "../pages/Alerts"

function AppRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/live-map" element={<LiveMap />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route
        path="*"
        element={
          <h1 className="mt-20 text-center text-3xl font-bold">
            404 - Page Not Found
          </h1>
        }
      />
    </Routes>
  );
}

export default AppRoutes;