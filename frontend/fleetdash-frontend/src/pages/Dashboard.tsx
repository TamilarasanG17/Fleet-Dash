import DashboardGrid from "../components/dashboard/DashboardGrid";

function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Fleet Dashboard
      </h1>

      <DashboardGrid />
    </div>
  );
}

export default Dashboard;