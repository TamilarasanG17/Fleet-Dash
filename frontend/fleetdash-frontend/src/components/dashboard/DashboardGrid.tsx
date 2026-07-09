import DashboardCard from "./DashboardCard";
import { dashboardData } from "../../data/dashboardData";

function DashboardGrid() {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">

      {dashboardData.map((card) => (
        <DashboardCard
          key={card.title}
          title={card.title}
          value={card.value}
          color={card.color}
        />
      ))}

    </div>
  );
}

export default DashboardGrid;