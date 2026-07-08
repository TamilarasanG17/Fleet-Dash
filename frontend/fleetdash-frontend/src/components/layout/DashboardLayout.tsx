import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

function DashboardLayout() {
  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 ml-64">

        <Header />

        <main className="p-6 bg-gray-100 min-h-screen">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;